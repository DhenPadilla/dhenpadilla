export const convert = async(tokenPrice) => {
    return await fetch(`https://api.coinconvert.net/convert/celo/usd?amount=${tokenPrice}`)
    .then((response) => response.json())
    .then((data) => data.USD);
}