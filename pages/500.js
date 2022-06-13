export default function Custom500({ message }) {
    return <h1>{message}</h1>
}

export function getStaticProps() {
    return {
        props: {
            message: 'Server-side error occured'
        }
    }
}