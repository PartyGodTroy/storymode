export default interface FileReference {
    base64: string;
    name: string | null;
    type: 'text' | 'image' | 'video' | 'gif' | 'script';
}
