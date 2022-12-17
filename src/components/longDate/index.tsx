type Props = {
    value: string
}

export const LongDate = ({ value }: Props ) => {
    const date = new Date(value)
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    }).format(date)

    return <div>{formattedDate}</div>
}