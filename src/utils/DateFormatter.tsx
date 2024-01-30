export interface DateFormatterProps {
	dateString: string;
}

const formatDate = ({ dateString }: DateFormatterProps) => {
	const dateObject = new Date(dateString);
	return dateObject.toLocaleDateString('en-US');
};

export default formatDate;
