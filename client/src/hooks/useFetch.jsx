import { useEffect, useState } from "react";

export const useFetch = (url) => {

    const apiEndpoint = import.meta.env.VITE_API
    console.log(apiEndpoint + url)

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(apiEndpoint + url)
        .then(res => res.json())
        .then(res => {
            setData(res)
            setIsLoading(false)
        })
        .catch(err => setError(err))
    }, [url])

    return {data, isLoading, error};
}