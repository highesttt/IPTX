export class SubtitleTrackDTO {
    id: number;
    language: string;
    selected: boolean;
    title: string;
    constructor(data: any) {
        this.id = data.index;
        this.language = data.language;
        this.title = data.title;
        this.selected = data.selected;
    }
}