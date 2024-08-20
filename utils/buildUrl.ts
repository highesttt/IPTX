import { MediaType } from "./MediaType";
import { retrieveData } from "./data";

export enum Action {
    GET_STREAMS = "get_live_streams",
    GET_MOVIES = "get_vod_streams",
    GET_SERIES = "get_series",
    GET_LIVE_CATEGORIES = "get_live_categories",
    GET_MOVIE_CATEGORIES = "get_vod_categories",
    GET_SERIES_CATEGORIES = "get_series_categories",
    GET_MOVIE_INFO = "get_vod_info",
    GET_SERIES_INFO = "get_series_info",
    GET_USER_INFO = "",
}

export async function buildURL(type: MediaType, id: string, extension: string = "") {
    const url = await retrieveData("url").then((data) => {
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    });
    const username = await retrieveData("username").then((data) => {
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    });
    const password = await retrieveData("password").then((data) => {
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    });

    if (!url || !username || !password) {
        return null;
    }
    if (!extension.startsWith(".")) {
        extension = extension ? `.${extension}` : "";
    }
    
    console.log("Building url...", `${url}/${type}${username}/${password}/${id}${extension}`);

    return `${url}/${type}${username}/${password}/${id}${extension}`;
}

export async function buildAPIURL(action: Action, id: string = "") {
    const url = await retrieveData("url").then((data) => {
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    });
    const username = await retrieveData("username").then((data) => {
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    });
    const password = await retrieveData("password").then((data) => {
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    });

    if (!url || !username || !password) {
        return null;
    }

    if (action === Action.GET_MOVIE_INFO) {
        id = `&vod_id=${id}`;
    } else if (action === Action.GET_SERIES_INFO) {
        id = `&series_id=${id}`;
    } else {
        id = id ? `&category_id=${id}` : "";
    }

    console.log("Building url...", `${url}/player_api.php?username=${username}&password=${password}&action=${action}${id}`);

    return `${url}/player_api.php?username=${username}&password=${password}&action=${action}${id}`;
}