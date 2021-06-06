window.addEventListener('load', (event) => {

    var allElements = document.querySelectorAll("*");
    var buyNowButton = Array.from(allElements).find(v => v.textContent === 'Buy Now');
    var addToCartButton = Array.from(allElements).find(v => v.textContent === 'Add to Cart');

    const buyNowButtonClass = 'buy-now-wrap';

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
            , timer = Array.from(document.getElementsByClassName("countDown"))
            , recommendations = Array.from(document.getElementsByClassName('may-like'))
            ,
            elementsToRemove = Array.from(new Set(
                coupons.concat(discountInfo, hurryUpInfo, quantityInfo, wishlistNum, soldNumber, oldPrice, timer, recommendations)
            ))

        elementsToRemove
            // .forEach(el => el.style.visibility = "hidden");
            .forEach(el => el.parentNode.removeChild(el));

        const priceBanner = document.querySelector('#root > div > div.product-main > div > div.product-info > div.uniform-banner');

        if (priceBanner != null) {
            const priceBannerElements = Array.from(priceBanner.children);
            priceBannerElements.push(priceBanner);
            const priceElements = Array.from(priceBanner.getElementsByClassName('uniform-banner-box-price'));
            priceElements.forEach(el => el.style.color = 'black');
            priceBannerElements.forEach(el => {
                el.style.backgroundImage = null;
                el.style.backgroundColor = 'white';
            })
        }

        changeElementColor(buyNowButton, 'grey', 'white');
    }

    function changeElementColor(element, backgroundColor, color) {
        [...element.children].forEach(el => {
            el.style.backgroundColor = backgroundColor;
            el.style.color = color;
        });
    }

    function findAlternativeUsesOfMoney(price) {
        let items = new Map();
        items.set('Pumpkin Spice Latte', 5.25);
        items.set('Bread', 2.50);
        items.set('Hot Dog', 1);
        items.set('Scratch-off lottery ticket', 1);
        items.set('McDonald\'s Bacon McDouble', 2);
        items.set('Pepperoni Pizza', 11.99);
        items.set('Bud Light 6-pack', 5.79);
        items.set('Taco Bell taco', 1.99);
        items.set('Lipstick', 5);
        items.set('Fancy restaurant dinner', 50);

        return [...items].filter(function ([itemName, itemPrice]) {
            return (itemPrice < price);
        }).map(function ([itemName, itemPrice]) {
            return [itemName, Math.round(price / itemPrice)];
        });
    }

    function cancelRedirect(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function validateReasonsInput(reasonsString) {
        const reasons = reasonsString.split(',');
        console.log(reasons);
        if (reasons.length < 3) {
            return false;
        }
        return !reasons.some(function (reason) {
            return reason.length < 5;
        });
    }

    function createAlternativeUsesOfMoneyMessage(price) {
        return "The price if this item is " + price + "$.\n" +
            "With this money, you could buy:\n" +
            findAlternativeUsesOfMoney(price)
                .map(function ([name, count]) {
                        return "- " + count + " " + name + "s"
                    }
                ).join(" or \n") +
            "\nAre you still sure you want to buy this?";
    }

    function askToListReasonsForBuying(event) {
        let reasons = prompt("List at least 3 reasons (separated by comma) why you need this thing.");
        if (reasons == null || reasons === "") {
            cancelRedirect(event);
        } else if (!validateReasonsInput(reasons)) {
            alert("Insufficient explanation, sorry! :(");
            cancelRedirect(event);
        }
    }

    function productActionHandler(event) {
        const targetButton = event.target.parentElement;
        if (targetButton.className === buyNowButtonClass && !targetButton.ariaHasPopup) {
            console.log('ready to buy');
            const price = getPrice();
            console.log(price);

            if (confirm("Are you completely sure you need this?") === true &&
                confirm("Are you really going to use it?") === true &&
                confirm(createAlternativeUsesOfMoneyMessage(price)) === true) {
                        askToListReasonsForBuying(event);
            } else {
                cancelRedirect(event);
            }

            // to raczej tymczasowe do testowania
            // chrome.runtime.sendMessage({type: 'buying', message: price});
        }
    }

    function getPrice() {
        const priceCurrent = document.getElementsByClassName('product-price-value')[0];
        const priceOnBanner = document.getElementsByClassName('uniform-banner-box-price')[0];
        let price = priceCurrent || priceOnBanner;
        price = price.textContent;
        if (price.includes('-')) return null;
        price = getNumberFromText(price);

        let quantity = document.getElementsByClassName('product-quantity')[0]
            .querySelector('span > span > span.next-input.next-medium.next-input-group-auto-width > input')
            .value;
        quantity = parseFloat(quantity);

        let shipping = document.getElementsByClassName('product-shipping-price')[0].getElementsByTagName('span')[0];
        shipping = shipping.textContent;
        const shippingCost = (shipping.trim() === 'Free Shipping') ? 0 : getNumberFromText(shipping);

        return price * quantity + shippingCost;
    }

    function getNumberFromText(text) {
        const numberRegex = /\d+(?:\.\d*)?/;
        let match = text.match(numberRegex);

        return parseFloat(match[0]);
    }

    removeElementsCausingProductDesire()

    const productAction = document.getElementsByClassName('product-action')[0];
    productAction.addEventListener('click', productActionHandler);

    const observer = new MutationObserver(mutations => {
        let newBuyNowButton = mutations.flatMap(mutation => Array.from(mutation.addedNodes)).find(node => node.className === buyNowButtonClass);
        if (newBuyNowButton != null) changeElementColor(newBuyNowButton, 'grey', 'white');
    })
    observer.observe(productAction, { childList: true });
});