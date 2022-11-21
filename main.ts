import { getInput, info, setFailed } from "@actions/core";
import { Octokit } from "@octokit/rest";

const authToken = getInput("token");
const ownerRepo = getInput("ownerRepo");
// const existsCount = getInput("existsCount");

const main = async () => {

    try {
//        const remainingCount = parseInt(existsCount);
        const spliter = ownerRepo.split('/');
        const owner = spliter[0];
        const repo = spliter[1];

        const appOctokit = new Octokit({
            auth: authToken,
        });

        const resArtifacts = await appOctokit.rest.actions.listArtifactsForRepo({
            owner,
            repo
        });

        info("listArtifactsForRepo OK");

        const counter = resArtifacts.data.total_count;

        const sortedArtifacts = resArtifacts.data.artifacts.sort(function (a, b) {
            if (a.updated_at === null) return 0;
            if (b.updated_at === null) return 0;
            if (a.updated_at > b.updated_at) return 1;
            if (a.updated_at < b.updated_at) return -1;
            return 0;
        });

        info("listArtifactsForRepo Sorted OK");

//        for (let i = 0; i < counter - remainingCount; i++) {
    for (let i = 0; i < counter - 1; i++) {

            const artifact_id : number= sortedArtifacts[i].id;
            info("update_at" + sortedArtifacts[i].updated_at || "null");
            info("id:" + artifact_id.toString());

            await appOctokit.rest.actions.deleteArtifact({
                owner,
                repo,
                artifact_id
            })
        }
    }
    catch (error: any) {
        setFailed(error.message)
    }
};

main();
