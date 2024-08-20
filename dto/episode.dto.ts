export class EpisodeDTO {
    season: number;
    episode: number;
    title: string;
    extension: string;
    release_date: string;
    duration: string;
    constructor(data: any, season: number) {
        this.season = season;
        this.episode = data.episode_num;
        this.title = data.title;
        this.extension = data.container_extension;
        this.release_date = data.info.air_date;
        this.duration = data.info.duration;
    }
}