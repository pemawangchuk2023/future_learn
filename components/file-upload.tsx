"use client";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import { toast } from "sonner";

interface FileUploadProps {
	onChange: (url?: string) => void;
	endPoint: keyof typeof ourFileRouter;
}
const FileUpload = ({ onChange, endPoint }: FileUploadProps) => {
	return (
		<UploadDropzone
			endpoint={endPoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0]?.ufsUrl);
			}}
			onUploadError={(error: Error) => {
				console.error("Upload failed:", error);
				toast(
					"Something went wrong while uploading your file. Please try again."
				);
			}}
			className='w-fit'
		/>
	);
};

export default FileUpload;
