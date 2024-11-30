import { Editor } from './editor'

interface DocumentIdPageProps {
	params: Promise<{ documentId: string }>
}

export default async function Page({ params }: DocumentIdPageProps) {
	const { documentId } = await params

	return (
		<div className="min-h-screen bg-[#FAFBFD]">
			<Editor />
		</div>
	)
}
