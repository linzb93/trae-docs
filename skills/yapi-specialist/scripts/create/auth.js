import fs from 'fs-extra';
import { join } from 'node:path';

class YapiAuth {
    async getToken(projectId) {
        try {
            // eslint-disable-next-line no-undef
            const secretPath = join(process.cwd(), 'secret.json');
            if (!fs.existsSync(secretPath)) {
                console.log('未找到 secret.json 文件');
                return null;
            }
            const secret = await fs.readJSON(secretPath);
            const yapiList = secret.yapiList || [];
            const project = yapiList.find((item) => String(item.projectId) === String(projectId));

            if (!project || !project.token) {
                console.log(`未找到 projectId: ${projectId} 的 token`);
                return null;
            }
            return project.token;
        } catch (error) {
            console.log('读取 token 失败:');
            console.log(error && error.message ? error.message : error);
            return null;
        }
    }
}

export const yapiAuth = new YapiAuth();
