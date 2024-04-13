import { CategoryDTO } from "../dto/category.dto";
import { LiveDTO } from "../dto/media/live.dto";
import { MovieDTO } from "../dto/media/movie.dto";
import { SeriesDTO } from "../dto/media/series.dto";
import { MovieInfoDTO } from "../dto/media_info/movie_info.dto";
import { SeriesInfoDTO } from "../dto/media_info/series_info.dto";
import { UserDTO } from "../dto/user.dto";
import { MediaType } from "./MediaType";
import { Action, buildAPIURL } from "./buildUrl";

export async function retrieveUser() {
    var url = await buildAPIURL(Action.GET_USER_INFO);

    if (url === null) {
        return null;
    }
    return await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const userData = new UserDTO(data);
            return userData;
        });
}

export async function retrieveCategories(type: MediaType) {
    var url = null;
    if (type === MediaType.LIVE) {
        url = await buildAPIURL(Action.GET_LIVE_CATEGORIES);
    } else if (type === MediaType.MOVIE) {
        url = await buildAPIURL(Action.GET_MOVIE_CATEGORIES);
    } else if (type === MediaType.SERIES) {
        url = await buildAPIURL(Action.GET_SERIES_CATEGORIES);
    }

    if (url === null) {
        return [];
    }

    return await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const categories = data.map((item: any) => new CategoryDTO(item));
            return categories;
        });
}

export async function retrieveCategoryInfo(type: MediaType, id?: string) {
    if (type === MediaType.LIVE) {
        const url = await buildAPIURL(Action.GET_STREAMS, id);
        if (url === null) {
            return [];
        }
        return await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data.map((item: any) => new LiveDTO(item));
            });
    } else if (type === MediaType.MOVIE) {
        const url = await buildAPIURL(Action.GET_MOVIES, id);
        if (url === null) {
            return [];
        }
        return await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data.map((item: any) => new MovieDTO(item));
            });
    } else if (type === MediaType.SERIES) {
        const url = await buildAPIURL(Action.GET_SERIES, id);
        if (url === null) {
            return [];
        }
        return await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data.map((item: any) => new SeriesDTO(item));
            });
    }

    return [];
}

export async function retrieveMediaInfo(type: MediaType, id?: string) {
    if (type === MediaType.MOVIE) {
        const url = await buildAPIURL(Action.GET_MOVIE_INFO, id);
        if (url === null) {
            return null;
        }
        return await fetch(url)
            .then((response) => response.json())
            .then((data) => new MovieInfoDTO(data));
    } else if (type === MediaType.SERIES) {
        const url = await buildAPIURL(Action.GET_SERIES_INFO, id);
        if (url === null) {
            return null;
        }
        return await fetch(url)
            .then((response) => response.json())
            .then((data) => new SeriesInfoDTO(data, id || ""));
    }

    return null;
}