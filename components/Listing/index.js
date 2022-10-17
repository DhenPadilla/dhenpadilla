import Router, { useRouter } from "next/router";

const Listing = (props) => {
    const router = useRouter();

    return (
        <div>
            <div className="inline-block flex-none h-[400px] align-bottom ease-in duration-100 hover:cursor-pointer hover:opacity-70"
                key={props.tokenId}
                onClick={() => router.push(`/gallery/${props.tokenId}`)}>
                <img
                    className="object-cover h-full"
                    src={props.imageUrl}
                    alt={props.name}
                />
                <h2 className="mt-2 text-md">{props.name}</h2>
            </div>
        </div>
    )
}
export default Listing;