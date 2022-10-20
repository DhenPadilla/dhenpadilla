import { utils } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { convert } from "../../utils/converter";

const Listing = (props) => {
    const router = useRouter();
    const { isConnected } = useAccount();
    const [price, setPrice] = useState();

    const getPrice = async() => {
        if (!isConnected) return;
        const celoPrice = utils.formatUnits(props.price, 18);
        const usdPrice = await convert(celoPrice);
        setPrice(usdPrice);
    }

    useEffect(() => {
        getPrice();
    }, [props.price])


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
                { isConnected &&  
                    <div>
                        <p className="mt-2 text-sm">{(props.buyer !== null) ? `buyer: ${props.buyer}` : `available`}{(props.buyer === null && price !== null) ? `: $${price}` : ``}</p>
                    </div>
                }
            </div>
        </div>
    )
}
export default Listing;