import i18n from 'i18next';
import { Placeholder } from 'react-bootstrap';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            createUserTitle: 'Make a User Account',
            firstName: 'First Name',
            lastName: 'Last Name',
            firstNamePlaceholder: 'Enter your first name',
            lastNamePlaceholder: 'Enter your last name',
            username: 'Username',
            usernamePlaceholder: 'Enter your username',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            email: 'Email',
            emailPlaceholder: 'Enter your email address',
            phone: 'Phone',
            phonePlaceholder: 'Enter your phone number',
            city: 'City',
            cityPlaceholder: 'Enter your home city',
            street: 'Street Address',
            streetPlaceholder: 'Enter your street address',
            zipcode: 'Zip Code',
            zipcodePlaceholder: 'Enter zip code',
            createAccount: 'Create Account',
            returnToLogin: 'Return to Login',
            goToLogin: 'Go to Login',
            createSuccess: 'Creation Successful',
            accountCreateSuccess: 'Account creation was successful. Happy shopping!',
            welcomeMessage: 'Welcome',
            emptyCart: 'Your cart is empty.',
            cartCount: 'Your cart has',
            items: 'item(s)',
            login: 'Login',
            navToCreateAccount: 'Or, if you need to make an account, ',
            clickHere: 'Click Here',
            loginSuccess: 'Login Successful!',
            loginSuccessMessage: 'Successfully logged in. Welcome back, ',
            startShopping: 'Start Shopping',
            logout: 'Logout',
            eCommerceTitleNav: 'E-Commerce Platform',
            homeNav: 'Home',
            updateNav: 'Update Account Information',
            cartNav: 'View Cart',
            orderHistory: 'Order History',
            cartId: 'Cart ID',
            orderDate: 'Order Date',
            totalPrice: 'Total Price',
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            productName: 'Product Name',
            productPrice: 'Price',
            productQuantity: 'Quantity',
            noOrders: 'No orders found',
            unknown: 'Unknown',
            catalog: 'Product Catalog',
            filter: 'Filter by',
            showAll: 'Show All',
            sortProducts: 'Sort Products by',
            productTitle: 'Title',
            productCat: 'Category',
            priceAsc: 'Price Asc.',
            priceDesc: 'Price Desc.',
            searchProducts: 'Search Products',
            minPrice: 'Minimum Price',
            maxPrice: 'Maximum Price',
            searchPlaceholder: 'Enter the name of the product',
            minPricePlaceholder: 'Enter minimum price',
            maxPricePlaceholder: 'Enter maximum price',
            altImgTxt: 'picture of',
            addToCart: 'Add to Cart',
            shoppingCart: 'Shopping Cart',
            removeFromCart: 'Remove from Cart',
            totalItems: 'Total Items',
            checkout: 'Checkout',
            returnToHome: 'Return to Home',
            doneCheckout: 'All Checked Out!',
            checkoutMessage: 'Product has been successfully checked out!',
            returnToCatalog: 'Return to Product Catalog',
            updateInfo: 'Update Account Information',
            updateAccount: 'Update Account',
            deleteAccount: 'Delete Account',
            updateSuccess: 'Update Successful!',
            deleteSuccess: 'Deletion Successful',
            updateSuccessMessage: 'Account update successful. Happy shopping!',
            deleteSuccessMessage: "Account successfully deleted. We'll miss you!",
            deleteConfirm: 'Are you sure you want to delete your account?',
            deleteConfirmMessage: 'This action is irreversible.',
            cancel: 'Cancel',
            delete: 'Delete',
            errorMessage: 'An error occurred'
        },
    },
    fr: {
        translation: {
            createUserTitle: 'Créer un Compte Utilisateur',
            firstName: 'Prénom',
            lastName: 'Nom de Famille',
            firstNamePlaceholder: 'Entrez votre prénom',
            lastNamePlaceholder: 'Entrez votre nom de famille',
            username: "Nom d'Utilisateur",
            usernamePlaceholder: "Entrez votre nom d'utilisateur",
            password: 'Mot de passe',
            passwordPlaceholder: 'Entrez votre mot de passe',
            email: 'Email',
            emailPlaceholder: "Entrez votre adresse email",
            phone: 'Téléphone',
            phonePlaceholder: 'Entrez votre numéro de téléphone',
            city: 'Ville',
            cityplaceholder: 'Entrez votre ville où vous habitez',
            street: 'Adresse de la Rue',
            streetPlaceholder: 'Entre votre adressse de la rue',
            zipcode: 'Code Postal',
            zipcodePlaceholder: 'Entre votre code postal',
            createAccount: 'Créer un compte',
            returnToLogin: 'Revenir à le Connecter',
            goToLogin: 'Allez dans Connecter',
            createSuccess: 'Création Réussie',
            accountCreateSuccess: 'La création du compte a réussi. Bons achats!',
            welcomeMessage: 'Bienvenu',
            emptyCart: 'Votre panier est vide.',
            cartCount: 'Votre panier contient',
            items: 'article(s)',
            login: 'Se connecter',
            navToCreateAccount: 'Ou, si vous avez besoin de créer un compte, ',
            clickHere: 'Cliquez Ici',
            loginSuccess: 'Connexion réussie!',
            loginSuccessMessage: 'Connexion réussie. Bienvenue, ',
            startShopping: 'Commencer vos achats',
            logout: 'Déconnexion',
            eCommerceTitleNav: 'Plateforme de Commerce Électronique',
            homeNav: "Page d'accueil",
            updateNav: 'Mettre à Jour les Informations du Compte',
            cartNav: 'Voir le panier',
            orderHistory: 'Histoire des Commandes',
            cartId: 'Identifiant du panier',
            orderDate: 'Date de Commande',
            totalPrice: 'Prix Total',
            viewDetails: 'Afficher les Détails',
            hideDetails: 'Masquer les détails',
            productName: 'Nom de Produit',
            productPrice: 'Prix',
            productQuantity: 'Quantité',
            noOrders: 'Aucune commande trouvée',
            unknown: 'Inconnue',
            catalog: 'Catalogue de Produit',
            filter: 'Rechercher par',
            showAll: 'Afficher Tout',
            sortProducts: 'Trier le produits par',
            productTitle: 'Titre',
            productCat: 'Catégorie',
            priceAsc: 'Prix Ascendant',
            priceDesc: 'Prix Descendante',
            searchProducts: 'Rechercher des Produits',
            minPrice: 'Prix Minimum',
            maxPrice: 'Prix Maximum',
            searchPlaceholder: 'Entrez le nom de produit',
            minPricePlaceholder: 'Entrez le prix minimum',
            maxPricePlaceholder: 'Entrez le prix maximum',
            altImgTxt: 'photo de',
            addToCart: 'Ajouter au panier',
            shoppingCart: 'Panier de Faire du Shopping',
            removeFromCart: 'Retirer du Panier',
            totalItems: 'Article Totaux',
            checkout: 'Vérifier',
            returnToHome: "Retour à la Page d'Accueil",
            doneCheckout: 'Tous vérifiés!',
            checkoutMessage: 'Le produit a été vérifié avec succès!',
            returnToCatalog: 'Retour au catalogue de produits',
            updateInfo: 'Mettre à jour les informations du compte',
            updateAccount: 'Mettre à jour le compte',
            deleteAccount: 'Supprimer le compte',
            updateSuccess: 'Mise à Jour Réussie!',
            deleteSuccess: 'Suppression Réussie',
            updateSuccessMessage: 'Mise à jour du compte réussie. Bon shopping!',
            deleteSuccessMessage: "Compte supprimé avec succès. Tu vas nous manquer!",
            deleteConfirm: 'Etes-vous sûr de vouloir supprimer votre compte?',
            deleteConfirmMessage: 'Cette action est irréversible.',
            cancel: 'Annuler',
            delete: 'Supprimer',
            errorMessage: "Une erreur s'est produite"
        }
    }
}
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', //Language to use initially
        keySeparator: false, // We do not use keys in form messages.welcome
        interpolation: {
            escapevalue: false, // React already safes form XSS
        },
    });

export default i18n;