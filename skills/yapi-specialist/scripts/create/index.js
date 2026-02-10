import { join } from 'node:path';
import fs from 'fs-extra';
import dayjs from 'dayjs';
import { getYapiInterfaceTotal, getYapiInterfaceList, getYapiInterfaceDetail } from './api.js';
import { yapiAuth } from './auth.js';
import pMap from 'p-map';

class Main {
    constructor() {
        this.docsPath = 'docs/api';
        this.contentPath = join(this.docsPath, 'content');
        this.indexPath = join(this.docsPath, 'index.json');
        this.apiDocs = [];
    }

    safeJsonParse(text, fallback) {
        if (typeof text !== 'string') return fallback;
        const trimmed = text.trim();
        if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return fallback;
        try {
            return JSON.parse(trimmed);
        } catch {
            return fallback;
        }
    }

    async main(url) {
        this.ensureDirectoriesExist();
        try {
            const urlInfo = this.parseYapiUrl(url);
            if (!urlInfo) {
                console.log('无效的Yapi URL');
                return;
            }
            const token = await yapiAuth.getToken(urlInfo.projectId);
            if (!token) {
                console.log('无法获取Yapi token');
                return;
            }

            if (urlInfo.type !== 'single') {
                const total = await getYapiInterfaceTotal({
                    origin: urlInfo.origin,
                    token,
                    projectId: urlInfo.projectId,
                    catId: urlInfo.type === 'category' ? urlInfo.catId : undefined,
                });
                if (!total) {
                    console.log('未找到接口文档');
                    return;
                }
                const apiList = await getYapiInterfaceList({
                    origin: urlInfo.origin,
                    token,
                    projectId: urlInfo.projectId,
                    total,
                    catId: urlInfo.type === 'category' ? urlInfo.catId : undefined,
                });
                if (!apiList || apiList.length === 0) {
                    console.log('未找到接口文档');
                    return;
                }
                await this.getApiDetails(urlInfo.origin, apiList, token);
                await this.updateIndexFile();
                console.log(
                    `成功获取${this.apiDocs.length}个接口文档。信息如下：\n${this.apiDocs.map((doc) => `项目ID：${doc.projectId}，文档ID：${doc._id}`).join('\n')}`,
                );
            } else {
                await this.getApiDetails(urlInfo.origin, [{ _id: urlInfo.apiId }], token);
                await this.updateIndexFile();
                console.log(
                    `成功获取${this.apiDocs.length}个接口文档。项目ID：${urlInfo.projectId}，文档ID：${urlInfo.apiId}`,
                );
            }
        } catch (error) {
            console.log('获取接口文档失败');
            console.log(error && error.message ? error.message : error);
        }
    }
    /**
     * 确保必要的目录存在
     */
    ensureDirectoriesExist() {
        [this.docsPath, this.contentPath].forEach((dir) => {
            if (!fs.pathExistsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    parseYapiUrl(url) {
        try {
            const urlObj = new URL(url);
            const { origin, pathname } = urlObj;
            const parts = pathname.split('/');
            const projectIdIndex = parts.indexOf('project');
            if (projectIdIndex === -1 || !parts[projectIdIndex + 1]) {
                return null;
            }
            const projectId = parts[projectIdIndex + 1];
            if (pathname.includes('/cat_')) {
                const catId = parts[parts.length - 1].replace('cat_', '');
                return { origin, type: 'category', projectId, catId };
            } else if (pathname.includes('/interface/api/') && !parts[parts.length - 1].startsWith('cat_')) {
                const apiId = parts[parts.length - 1];
                return { origin, type: 'single', projectId, apiId };
            } else {
                return { origin, type: 'all', projectId };
            }
        } catch {
            return null;
        }
    }

    async getApiDetails(origin, apiList, token) {
        await pMap(
            apiList,
            async (apiItem) => {
                try {
                    const apiDetail = await getYapiInterfaceDetail(origin, token, apiItem._id);
                    if (!apiDetail) {
                        console.log(`获取接口 ${apiItem._id} 详情失败`);
                        return;
                    }
                    const indexItem = {
                        id: apiDetail._id,
                        title: apiDetail.title,
                        path: apiDetail.path,
                        method: apiDetail.method,
                        updateTime: dayjs(apiDetail.up_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
                        projectId: apiDetail.project_id,
                        catId: apiDetail.catid,
                    };
                    this.apiDocs.push(indexItem);
                    const contentDir = join(this.contentPath, `${apiDetail.project_id}-${apiDetail._id}`);
                    if (!fs.existsSync(contentDir)) {
                        fs.mkdirSync(contentDir, { recursive: true });
                    }
                    const originFile = join(contentDir, 'origin.json');
                    const parsedRequestBody = this.safeJsonParse(apiDetail.req_body_other, null);
                    const parsedResponseBody = this.safeJsonParse(apiDetail.res_body, null);
                    fs.writeFileSync(
                        originFile,
                        JSON.stringify(
                            {
                                ...indexItem,
                                request: {
                                    query: apiDetail.req_query ?? [],
                                    body: parsedRequestBody,
                                    bodyRaw: parsedRequestBody ? undefined : apiDetail.req_body_other,
                                },
                                response: {
                                    body: parsedResponseBody,
                                    bodyRaw: parsedResponseBody ? undefined : apiDetail.res_body,
                                },
                            },
                            null,
                            4,
                        ),
                    );
                    const apiMdFile = join(contentDir, 'api.md');
                    if (!fs.existsSync(apiMdFile)) {
                        fs.writeFileSync(apiMdFile, '');
                    }
                } catch (error) {
                    console.log(`处理接口 ${apiItem._id} 时出错:`);
                    console.log(error && error.message ? error.message : error);
                }
            },
            { concurrency: 4 },
        );
    }

    async updateIndexFile() {
        try {
            let existingDocs = [];
            if (fs.pathExistsSync(this.indexPath)) {
                try {
                    existingDocs = await fs.readJSON(this.indexPath);
                } catch {
                    console.log('读取索引文件失败，将创建新文件');
                }
            }
            const mergedDocs = [...existingDocs];
            this.apiDocs.forEach((newDoc) => {
                const existingIndex = mergedDocs.findIndex(
                    (doc) => doc.id === newDoc.id && doc.projectId === newDoc.projectId,
                );
                if (existingIndex === -1) {
                    mergedDocs.push(newDoc);
                } else if (mergedDocs[existingIndex].updateTime < newDoc.updateTime) {
                    mergedDocs[existingIndex] = newDoc;
                }
            });
            await fs.writeJSON(this.indexPath, mergedDocs, { spaces: 4 });
        } catch (error) {
            console.log('更新索引文件失败:');
            console.log(error && error.message ? error.message : error);
        }
    }
}
// eslint-disable-next-line no-undef
new Main().main(process.argv[2]);
