import supabase from "../supabase";
import getAliExpressAffiliateLink from "./link-generator";


(async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('affiliation_link', '')
        
    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log('Products fetched successfully:', data.length + ' products found');
        // Process the products as needed


        for (const product of data) {
            let affiliationLink = await getAliExpressAffiliateLink(product.url);

            console.log(`Processing product ${product.product_id}: ${affiliationLink}`);

            const { data: updatedData, error: updateError } = await supabase
                .from('products')
                .update({ affiliation_link: affiliationLink })
                .eq('product_id', product.product_id);

            if (updateError) {
                console.error(`Error updating product ${product.product_id}:`, updateError);
            } else {
                console.log(`Product ${product.product_id} updated successfully with affiliation link.`);
            }
        }
        console.log('All products processed.');
    }
})();