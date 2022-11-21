/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const rest_1 = require("@octokit/rest");
const authToken = (0, core_1.getInput)("token");
const ownerRepo = (0, core_1.getInput)("ownerRepo");
const existsCount = (0, core_1.getInput)("existsCount");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const remainingCount = parseInt(existsCount);
        const spliter = ownerRepo.split('/');
        const owner = spliter[0];
        const repo = spliter[1];
        const appOctokit = new rest_1.Octokit({
            auth: authToken,
        });
        const resArtifacts = yield appOctokit.rest.actions.listArtifactsForRepo({
            owner,
            repo
        });
        const counter = resArtifacts.data.total_count;
        const sortedArtifacts = resArtifacts.data.artifacts.sort(function (a, b) {
            if (a.updated_at === null)
                return 0;
            if (b.updated_at === null)
                return 0;
            if (a.updated_at > b.updated_at)
                return 1;
            if (a.updated_at < b.updated_at)
                return -1;
            return 0;
        });
        for (let i = 0; i < counter - remainingCount; i++) {
            const artifact_id = sortedArtifacts[i].id;
            (0, core_1.info)("update_at" + sortedArtifacts[i].updated_at || 0);
            (0, core_1.info)("id:" + artifact_id.toString());
            yield appOctokit.rest.actions.deleteArtifact({
                owner,
                repo,
                artifact_id
            });
        }
    }
    catch (error) {
        (0, core_1.setFailed)(error.message);
    }
});
main();
//# sourceMappingURL=main.js.map
