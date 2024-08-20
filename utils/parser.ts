import { parseM3U } from "@iptv/playlist";

export async function getPlaylist(file: any) {
    const uri = file.fileCopyUri;

    const res = await fetch(uri);
    const content = await res.text();

    const playlist = parseM3U(content);

    const channels = playlist.channels;
    return channels;
}
export async function getPlaylistFromURL(url: any) {
    const uri = url;

    const res = await fetch(uri);
    const content = await res.text();

    const playlist = parseM3U(content);

    const channels = playlist.channels;
    return channels;
}