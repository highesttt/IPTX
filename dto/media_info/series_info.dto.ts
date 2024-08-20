import { EpisodeDTO } from "../episode.dto";
import { MediaInfoDTO } from "./media_info.dto";

export class SeriesInfoDTO extends MediaInfoDTO {
    episodes: EpisodeDTO[];
    constructor(data: any) {
        super(data);
        this.episodes = Object.keys(data.episodes).flatMap((season) => {
            return data.episodes[season].map((episode: any) => {
                return new EpisodeDTO(episode, parseInt(season));
            });
        })
    }
}