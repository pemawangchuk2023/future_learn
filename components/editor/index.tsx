"use client";

import {
	MDXEditor,
	UndoRedo,
	BoldItalicUnderlineToggles,
	toolbarPlugin,
	CodeToggle,
	InsertCodeBlock,
	codeBlockPlugin,
	headingsPlugin,
	listsPlugin,
	linkPlugin,
	quotePlugin,
	markdownShortcutPlugin,
	ListsToggle,
	linkDialogPlugin,
	CreateLink,
	InsertImage,
	InsertTable,
	tablePlugin,
	imagePlugin,
	codeMirrorPlugin,
	ConditionalContents,
	ChangeCodeMirrorLanguage,
	Separator,
	InsertThematicBreak,
	diffSourcePlugin,
	MDXEditorMethods,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import { Ref } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
	value: string;
	editorRef: Ref<MDXEditorMethods> | null;
	fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange }: Props) => {
	const { resolvedTheme } = useTheme();

	const themeExtension = resolvedTheme === "dark" ? [basicDark] : [];

	// Sanitize the initial value to prevent parsing issues
	const sanitizedValue = value || "";

	return (
		<div className='w-full'>
			<MDXEditor
				key={resolvedTheme}
				markdown={sanitizedValue}
				ref={editorRef}
				onChange={fieldChange}
				className='background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border'
				plugins={[
					headingsPlugin(),
					listsPlugin(),
					linkPlugin(),
					linkDialogPlugin(),
					quotePlugin(),
					markdownShortcutPlugin(),
					tablePlugin(),
					imagePlugin(),
					codeBlockPlugin({
						defaultCodeBlockLanguage: "javascript",
					}),
					codeMirrorPlugin({
						codeBlockLanguages: {
							css: "CSS",
							txt: "Plain Text",
							sql: "SQL",
							html: "HTML",
							sass: "Sass",
							scss: "SCSS",
							bash: "Bash",
							json: "JSON",
							js: "JavaScript",
							javascript: "JavaScript",
							ts: "TypeScript",
							typescript: "TypeScript",
							tsx: "TypeScript (React)",
							jsx: "JavaScript (React)",
							python: "Python",
							py: "Python",
							java: "Java",
							cpp: "C++",
							c: "C",
							php: "PHP",
							ruby: "Ruby",
							go: "Go",
							rust: "Rust",
							xml: "XML",
							yaml: "YAML",
							yml: "YAML",
							markdown: "Markdown",
							md: "Markdown",
							"": "Plain Text",
						},
						autoLoadLanguageSupport: true,
						codeMirrorExtensions: themeExtension,
					}),
					diffSourcePlugin({
						viewMode: "rich-text",
						diffMarkdown: "",
						readOnlyDiff: false,
					}),
					toolbarPlugin({
						toolbarContents: () => (
							<ConditionalContents
								options={[
									{
										when: (editor) => editor?.editorType === "codeblock",
										contents: () => <ChangeCodeMirrorLanguage />,
									},
									{
										fallback: () => (
											<>
												<UndoRedo />
												<Separator />

												<BoldItalicUnderlineToggles />
												<CodeToggle />
												<Separator />

												<ListsToggle />
												<Separator />

												<CreateLink />
												<InsertImage />
												<Separator />

												<InsertTable />
												<InsertThematicBreak />
												<Separator />

												<InsertCodeBlock />
											</>
										),
									},
								]}
							/>
						),
					}),
				]}
				contentEditableClassName='prose dark:prose-invert max-w-none'
			/>
		</div>
	);
};

export default Editor;
