import Environment from "../environment/environment";

export const compareMajorVersion = (version: string) => {
    const apiVersion = version.split('.');
    const majorVersion = apiVersion[0];

    const appApiVersion = Environment.apiVersion;
    const semAppApiVersions = appApiVersion.split('.');
    const appApiMajorVersion = semAppApiVersions[0];
    if (majorVersion > appApiMajorVersion) {
        return 1;
    }
    if (majorVersion < appApiMajorVersion) {
        return -1;
    }
    return 0;
}


