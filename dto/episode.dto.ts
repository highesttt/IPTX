export class EpisodeDTO {
    season: number;
    episode: number;
    title: string;
    extension: string;
    release_date: string;
    duration: string;
    id: string;
    background: string;
    constructor(data: any, season: number) {
        this.season = season;
        this.episode = data.episode_num;
        this.id = data.id;
        this.title = data.title;
        this.extension = data.container_extension;
        this.release_date = data.info.air_date;
        this.duration = data.info.duration;
        this.background = data.info.movie_image;
    }
}