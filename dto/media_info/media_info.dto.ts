export class MediaInfoDTO {
    name: string;
    cover: string;
    plot: string;
    background: string;
    cast: string;
    director: string;
    release_date: string;
    genre: string;
    tmdb_id: string;
    type: string;
    constructor(data: any) {
        this.name = data.info.name == undefined ? data.movie_data.name : data.info.name;
        this.cover = data.info.cover;
        this.plot = data.info.plot
        this.background = data.info.backdrop_path[0];
        this.cast = data.info.cast;
        this.director = data.info.director
        this.release_date = data.info.releasedate;
        this.genre = data.info.genre;
        this.tmdb_id = data.info.tmdb_id;
        this.type = 'unknown'
    }
}