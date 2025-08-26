import getAliExpressAffiliateLink from "./link-generator";

export async function sanatizeMessage(message: string) {
    // Extract affiliate link using regex
    let affiliateLink = message.match(/https:\/\/s.click.aliexpress.com\/e\/_[A-Za-z0-9]+/g)?.join('')
    console.log(' Affiliation Link : ', affiliateLink);
    if (!affiliateLink) {
        console.error('No Affiliation Link');
        return
    }
    // Get the original product link from the affiliate link
    const res = await fetch(affiliateLink, { redirect: "manual" });
    const location = res.headers.get("location");
    console.log("Original product link:", location);
    if (!location) {
        console.error('No original link.')
        return null;
    }
    // Generate the affiliate link using the original product link
    let myAffiliateLink = await getAliExpressAffiliateLink(location);
    console.log('My affiliation link:', myAffiliateLink);

    // remove unwanted parts from the message
    return message
        .split('\n')
        .map(msg => msg.replace('بوت يساعـدك للحصول على افضل سعر : ', '')
            .replace('t.me/ZedStoreOnline_bot', '')
            .replace('لي يراسلك ويقلك انا zed store ابلوكيه مباشرة ( نصاب ) ⚠️', '')
            .replace('بوت يساعـدك للحصول على تخفيض اي منتج :', '')
            .replace('بوت للحصول على تخفيضات اي منتج', '')
            .replace(/https:\/\/s.click.aliexpress.com\/e\/_[A-Za-z0-9]+/g, myAffiliateLink || '')
        )
        .join('\n')

}