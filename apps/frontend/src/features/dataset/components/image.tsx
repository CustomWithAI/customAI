import { ViewList } from "@/components/specific/viewList";
import { Subtle } from "@/components/typography/text";
import Image from "next/image";

export const ContentImage = () => {
	const viewList = ViewList.useViewListState();
	const images = [
		{
			src: "https://picsum.photos/200/300",
			alt: "Image 1",
			title: "Image 1 Title",
			description: "This is a description for Image 1.",
		},
		{
			src: "https://via.placeholder.com/150/f8d7da",
			alt: "Image 2",
			title: "Image 2 Title",
			description: "This is a description for Image 2.",
		},
		{
			src: "https://via.placeholder.com/150/ff6b6b",
			alt: "Image 3",
			title: "Image 3 Title",
			description: "This is a description for Image 3.",
		},
		{
			src: "https://via.placeholder.com/150/6bc6ff",
			alt: "Image 4",
			title: "Image 4 Title",
			description: "This is a description for Image 4.",
		},
	];

	return (
		<>
			<Subtle className="text-xs mb-3 font-medium">
				Found {images.length} {images.length > 1 ? "images" : "image"}
			</Subtle>
			{viewList === "Grid" ? (
				<div className="grid grid-cols-4 gap-4">
					{images.map((image, index) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center text-center"
						>
							<Image
								src={image.src}
								alt={image.alt}
								width={150}
								height={150}
								className="max-w-full max-h-full"
							/>
							<div className="mt-2">
								<h3 className="font-medium">{image.title}</h3>
								<p className="text-xs text-gray-400">{image.description}</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="list">
					{images.map((image, index) => (
						<div
							key={index}
							className="mb-4 text-center flex flex-col items-center justify-center"
						>
							<Image
								src={image.src}
								alt={image.alt}
								width={150}
								height={150}
								className="max-w-full max-h-full"
							/>
							<div className="mt-2">
								<h3 className="font-medium">{image.title}</h3>
								<p className="text-xs text-gray-500">{image.description}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};
