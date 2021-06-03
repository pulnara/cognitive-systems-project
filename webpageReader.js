window.addEventListener('load', (event) => {

    var allElements = document.querySelectorAll("*");
    var buyNowButton = Array.from(allElements).find(v => v.textContent === 'Buy Now');
    var addToCartButton = Array.from(allElements).find(v => v.textContent === 'Add to Cart');

    console.log(buyNowButton ? 'found!' : 'not found');
    console.log(addToCartButton ? 'found!' : 'not found');

    function isTextToHide(element) {
        return element.textContent.includes('pieces available') ||
            element.textContent.includes('% off') ||
            element.textContent === 'Enjoy special discounts!' ||
            element.textContent === 'Shop now & save more!';
    }

    function getImgsToRemove() {
        const imgsToRemove = [
            'https://ae01.alicdn.com/kf/H90fd07184d5949aebd8c0676fe02f429C.png',
            'https://ae01.alicdn.com/kf/H40d6759bc5ed4b0fb4ce1d780c1e871fL.png',
            'https://ae01.alicdn.com/kf/H01c1994a8c0746bbad4b6ef810fdd101V.png'
        ];

        var selectors = imgsToRemove.map(url => `img[src="${url}"]`).join(', ');

        return document.querySelectorAll(selectors);
    }

    function removeElementsCausingProductDesire() {
        const imgs = getImgsToRemove()

        for (const img of imgs) {
            img.parentNode.removeChild(img)
        }

        [...document.querySelectorAll("span")]
            .filter(isTextToHide)
            .forEach(el => el.style.visibility = "hidden");

        const coupons = Array.from(document.getElementsByClassName("product-coupon"))
            , discountInfo = Array.from(document.getElementsByClassName("uniform-banner-box-discounts"))
            , hurryUpInfo = Array.from(document.getElementsByClassName("uniform-banner-slogan")).filter(isTextToHide)
            , quantityInfo = Array.from(document.getElementsByClassName("product-quantity-info"))
            , soldNumber = Array.from(document.getElementsByClassName("product-reviewer-sold"))
            , wishlistNum = Array.from(document.getElementsByClassName("add-wishlist-num"))
            , oldPrice = Array.from(document.getElementsByClassName("product-price-original"))
            ,
            elementsToRemove = Array.from(new Set(
                coupons.concat(coupons, discountInfo, hurryUpInfo, quantityInfo, wishlistNum, soldNumber, oldPrice)
            ))

        elementsToRemove
            // .forEach(el => el.style.visibility = "hidden");
            .forEach(el => el.parentNode.removeChild(el));
    }

    /* prawie znalazlam cene, ale trzeba dac chyba jakis event na wyklikanie parametrow
    przyda sie do zliczania ceny, tak mysle tez, ze fajnie byloby pousuwac te wszystkie napisy "deal",
    liczniki ile do konca promocji i zmienic kolor z czerwonego na jakis neutralny
    (np. czarny tekst na bialym tle) albo wlasnie taki niemily dla oka (mocno czerwony?)
    przyklad wrzucam w pliku screen.png w repku :D */
    [...document.querySelectorAll("span")]
        .filter(el => el.textContent.includes('US $'))
        .forEach(el => console.log(el.textContent));

    removeElementsCausingProductDesire()

});