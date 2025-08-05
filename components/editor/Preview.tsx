import { MDXRemote } from "next-mdx-remote/rsc";

const Preview = ({ content }: { content: string }) => {
	const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

	return (
		<section className='markdown prose grid break-words'>
			<MDXRemote
				source={formattedContent}
				components={{
					pre: ({ children, ...props }) => (
						<pre
							{...props}
							className='bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto'
						>
							<code>{children}</code>
						</pre>
					),
				}}
			/>
		</section>
	);
};

export default Preview;
