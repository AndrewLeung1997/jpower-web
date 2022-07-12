import axios from "axios";
import { cfUrl } from "../config";

export async function upload(
    formData: FormData,
    setProgress?: (progress: number) => void
) {
    await axios.post(cfUrl, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.lengthComputable) {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                setProgress && setProgress(progress);
            }
        },
    });
}

export async function uploadPreview(params: {
    preview: File;
    id: number;
    setProgress?: (progress: number) => void;
}) {
    const { preview, id, setProgress } = params;
    const formData = new FormData();
    const name = `images/${id}-${preview.name}`;
    formData.append("key", name);
    formData.append("Content-Type", preview.type);
    formData.append("file", preview);
    try {
        await upload(formData, setProgress);
        return `${cfUrl}/images/${id}-${encodeURIComponent(preview.name)}`;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function uploadVideo(props: {
    id: number;
    file: File;
    setProgress?: (progress: number) => void;
}) {
    const { id, file, setProgress } = props;
    const formData = new FormData();
    const name = `videos/${id}-${file.name}`;
    formData.append("key", name);
    formData.append("Content-Type", file.type);
    formData.append(`file`, file);
    try {
        await upload(formData, setProgress);
        return `${cfUrl}/videos/${id}-${encodeURIComponent(file.name)}`;
    } catch (e) {
        console.error(e);
        return null;
    }
}
