'use client'

import {
	BoldIcon,
	ChevronDownIcon,
	HighlighterIcon,
	ItalicIcon,
	ListTodoIcon,
	LucideIcon,
	MessageSquarePlusIcon,
	PrinterIcon,
	Redo2Icon,
	RemoveFormattingIcon,
	SpellCheckIcon,
	UnderlineIcon,
	Undo2Icon,
} from 'lucide-react'
import { type Level } from '@tiptap/extension-heading'
import { ColorResult, SketchPicker } from 'react-color'

import { cn } from '@/lib/utils'
import { useEditorStore } from '@/store/use-editor-store'
import { Separator } from '@/components/ui/separator'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ToolbarButtonProps {
	onClick?: () => void
	isActive?: boolean
	icon: LucideIcon
}

const HighlightColorButton = () => {
	const { editor } = useEditorStore()

	const value = editor?.getAttributes('highlight').color || '##FFFFFF'

	const onChange = (color: ColorResult) => {
		editor?.chain().focus().setHighlight({ color: color.hex }).run()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex h-7 min-w-7 flex-col items-center justify-center rounded-sm text-sm hover:bg-stone-200/80">
					<HighlighterIcon className="size-4 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				<SketchPicker color={value} onChange={onChange} />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const TextColorButton = () => {
	const { editor } = useEditorStore()

	const value = editor?.getAttributes('textStyle').color || '#000000'

	const onChange = (color: ColorResult) => {
		editor?.chain().focus().setColor(color.hex).run()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex h-7 min-w-7 flex-col items-center justify-center rounded-sm text-sm hover:bg-stone-200/80">
					<span className="text-xs">A</span>
					<div
						className="h-0.5 w-full"
						style={{ backgroundColor: value }}
					></div>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				<SketchPicker color={value} onChange={onChange} />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const HeadingLevelButton = () => {
	const { editor } = useEditorStore()

	const headings = [
		{
			label: 'Normal Text',
			value: 0,
			fontSize: '16px',
		},
		{
			label: 'Heading 1',
			value: 1,
			fontSize: '32px',
		},
		{
			label: 'Heading 2',
			value: 2,
			fontSize: '24px',
		},
		{
			label: 'Heading 3',
			value: 3,
			fontSize: '20px',
		},
		{
			label: 'Heading 4',
			value: 4,
			fontSize: '18px',
		},
		{
			label: 'Heading 5',
			value: 5,
			fontSize: '16px',
		},
	]

	const getCurrentHeading = () => {
		for (let i = 0; i < headings.length; i++) {
			if (editor?.isActive('heading', { level: headings[i].value })) {
				return headings[i].label
			}
		}

		return headings[0].label
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-stone-200/80',
					)}
				>
					<span className="truncate">{getCurrentHeading()}</span>
					<ChevronDownIcon className="ml-2 size-4 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="flex flex-col gap-y-1 p-1">
				{headings.map(({ value, label, fontSize }) => (
					<button
						key={value}
						className={cn(
							'flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
							(value === 0 && !editor?.isActive('heading')) ||
								(editor?.isActive('heading', { level: value }) &&
									'bg-neutral-200/80'),
						)}
						style={{ fontSize: fontSize }}
						onClick={() => {
							if (value === 0) {
								editor?.chain().focus().setParagraph().run()
							} else {
								editor
									?.chain()
									.focus()
									.toggleHeading({ level: value as Level })
									.run()
							}
						}}
					>
						<span className="text-sm">Heading {label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const FontFamilyButton = () => {
	const { editor } = useEditorStore()

	const fonts = [
		{
			label: 'Arial',
			value: 'Arial',
		},
		{
			label: 'Times New Roman',
			value: 'Times New Roman',
		},
		{
			label: 'Courier New',
			value: 'Courier New',
		},
	]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'flex h-7 w-[120px] shrink-0 items-center justify-between overflow-hidden rounded-sm px-1.5 text-sm hover:bg-stone-200/80',
					)}
				>
					<span className="truncate">
						{editor?.getAttributes('textStyle').fontFamily || 'Arial'}
					</span>
					<ChevronDownIcon className="ml-2 size-4 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="flex flex-col gap-y-1 p-1">
				{fonts.map(({ label, value }) => (
					<button
						key={value}
						className={cn(
							'flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
							editor?.getAttributes('textStyle').fontFamily === value &&
								'bg-neutral-200/80',
						)}
						style={{ fontFamily: value }}
						onClick={() => {
							editor?.commands.setFontFamily(value)
						}}
					>
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const ToolbarButton = ({
	onClick,
	isActive,
	icon: Icon,
}: ToolbarButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
				isActive && 'bg-neutral-200/80',
			)}
		>
			<Icon className="size-4" />
		</button>
	)
}

export const Toolbar = () => {
	const { editor } = useEditorStore()

	const sections: {
		label: string
		icon: LucideIcon
		onClick: () => void
		isActive?: boolean
	}[][] = [
		[
			{
				label: 'Undo',
				icon: Undo2Icon,
				onClick: () => editor?.chain().focus().undo().run(),
			},
			{
				label: 'Redo',
				icon: Redo2Icon,
				onClick: () => editor?.chain().focus().redo().run(),
			},
			{
				label: 'Print',
				icon: PrinterIcon,
				onClick: () => window.print(),
			},
			{
				label: 'Spell Check',
				icon: SpellCheckIcon,
				onClick: () => {
					const current = editor?.view.dom.getAttribute('spellcheck')
					editor?.view.dom.setAttribute(
						'spellcheck',
						current === 'false' ? 'true' : 'false',
					)
				},
			},
		],
		[
			{
				label: 'Bold',
				icon: BoldIcon,
				onClick: () => editor?.chain().focus().toggleBold().run(),
				isActive: editor?.isActive('bold'),
			},
			{
				label: 'Italic',
				icon: ItalicIcon,
				onClick: () => editor?.chain().focus().toggleItalic().run(),
				isActive: editor?.isActive('italic'),
			},
			{
				label: 'Underline',
				icon: UnderlineIcon,
				onClick: () => editor?.chain().focus().toggleUnderline().run(),
				isActive: editor?.isActive('underline'),
			},
		],
		[
			{
				label: 'Comment',
				icon: MessageSquarePlusIcon,
				onClick: () => {},
				isActive: false,
			},
			{
				label: 'List Todo',
				icon: ListTodoIcon,
				onClick: () => editor?.chain().focus().toggleTaskList().run(),
				isActive: editor?.isActive('taskList'),
			},
			{
				label: 'Remove Formatting',
				icon: RemoveFormattingIcon,
				onClick: () => editor?.chain().focus().unsetAllMarks().run(),
			},
		],
	]

	return (
		<div className="flex min-h-[40px] items-center gap-x-0.5 overflow-x-auto rounded-[24px] bg-[#F1F4F9] px-2.5 py-0.5">
			{sections[0].map((item) => (
				<ToolbarButton key={item.label} {...item} />
			))}
			<Separator orientation="vertical" className="h-6 bg-neutral-200" />
			<FontFamilyButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-200" />
			<HeadingLevelButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-200" />
			{sections[1].map((item) => (
				<ToolbarButton key={item.label} {...item} />
			))}
			<Separator orientation="vertical" className="h-6 bg-neutral-200" />
			<TextColorButton />
			<HighlightColorButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-200" />
			{sections[2].map((item) => (
				<ToolbarButton key={item.label} {...item} />
			))}
		</div>
	)
}
