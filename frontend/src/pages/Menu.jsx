import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productInfo, setProductInfo] = useState(null);
    const [productInfoLoading, setProductInfoLoading] = useState(false);
    const [productInfoError, setProductInfoError] = useState(null);
    const { addToCart } = useCart();
    const BACKEND_ORIGIN = 'http://localhost:5000';

    const categories = [
        { id: 'all', name: 'All Items' },
        { id: 'cakes', name: 'Cakes' },
        { id: 'pastries', name: 'Pastries' },
        { id: 'breads', name: 'Breads' },
        { id: 'cookies', name: 'Cookies' },
        { id: 'desserts', name: 'Desserts' }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category === selectedCategory));
        }
    }, [selectedCategory, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Check your API server and network.');
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const fetchProductInfo = async (name) => {
        if (!name) return;
        setProductInfo(null);
        setProductInfoError(null);
        setProductInfoLoading(true);
        try {
            // First do an open search to find a matching page title
            const searchRes = await fetch(
                `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=1&namespace=0&format=json&origin=*`
            );
            const searchJson = await searchRes.json();
            const title = (searchJson && searchJson[1] && searchJson[1][0]) || null;

            if (!title) {
                setProductInfo(null);
                setProductInfoLoading(false);
                return;
            }

            // Fetch the summary for the title
            const summaryRes = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
                { headers: { 'Accept': 'application/json' } }
            );
            const summaryJson = await summaryRes.json();

            setProductInfo({
                title: summaryJson.title || title,
                extract: summaryJson.extract || (searchJson[2] && searchJson[2][0]) || '',
                url: (summaryJson.content_urls && summaryJson.content_urls.desktop && summaryJson.content_urls.desktop.page) || (searchJson && searchJson[3] && searchJson[3][0]) || null
            });
        } catch (err) {
            console.error('Failed to fetch product info:', err);
            setProductInfoError('Failed to load product info');
        } finally {
            setProductInfoLoading(false);
        }
    };

    const handleProductClick = async (product) => {
        // Start fetching external info, then open modal
        setSelectedProduct(product);
        setShowModal(true);
        fetchProductInfo(product && product.name);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setProductInfo(null);
        setProductInfoError(null);
        setProductInfoLoading(false);
    };

    const getProductImage = (product) => {
        // Check if the backend provides a proper full URL or data URI
        if (product && product.image) {
            const img = product.image;
            if (img.startsWith('http') || img.startsWith('data:')) return img;
        }

        // Product-specific images based on name and category
        const productImages = {
            // Cakes
            'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80',
            'Vanilla Cake': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
            'Strawberry Cake': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80',
            'Red Velvet Cake': 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
            'Black Forest Cake': 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
            'Cheesecake': 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            

            // Pastries
            'Croissant': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMWFhUXGBUYGBgXFxcVGBYYFxcYFxUYGBUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAQIDBQYABwj/xABCEAABAwEFBQUFBgUDAwUAAAABAAIRAwQSITFBBVFhcYETIpGhsQYywdHwFEJSYoLhFVNyovEWIzMHktJUY3Ozwv/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAEBf/EACQRAAICAgICAwADAQAAAAAAAAABAhEDIRIxBEETIlEjYXEU/9oADAMBAAIRAxEAPwDzW0umDuQdF8Pnf8Uba2KtqP8AELz8atHrzdMu9n1YecdCpra/utbqRJWes9rLXAkrQ2TZdotEOpUnubgLwEN8TgVOWFqVjrMmgG0nHlEJ1GgSxzwciVcWvYDaZivaqFI/hBNR3VrfmustqsFGR2lW0E/dYwtB88v1BVjilXRN54J9guzNqPaGzJBMKWyWLsalStaH9hTd7od/yuGt2mO94woLdtSocLLRbZmj70g1CP6sS3oVW06QJvGajzm9858AfUqsIKNts58uRz0kaat7XPu9lYaQY3LtqgF48Q1VDaBv36r3Vamd5xmDwGinpNgLkzkTUUiSgJJJRFFuCiomARvU7jEJCiFq68kVSonsx6IOo/Aqxa+GDDQJWMAus5GMYIWqEZUrHLRS0dl16vuUnEb8h4lNyS7Eq+iqCf2pVo72ctP8r+5nzTv4BWY1zqlJ7QBMxI8Qt8kH00DhJegSm8xMqOo6U3tO6AlDoRo1kbU3Zrv9tw/MU6+Sodle4/8AqKzMg+zZqSrTcQ5wGA1T9mWY1KjWNzJ8BqtF7WWcUKNNjRmceKXJqDYYO5pGQNMNaJOeJVhZCCMBDfVAVsWSidk+7jvXB0dzdosH203N3yQRrVqhAZICkqVWnvOyBiApHUC5wLXECMluxRvYWj8QXKb7CfxHxXIWEwlajXObqLOdVnwJQn2SmDNW0NPCkDUd44DzVxZdlNqEXabWA6uwnyU1CxOaHOYxt1pgvwI6Tn0Xqpxj0jz2py7ZHsttMOb9nsTqr/uurku63O6weaJtu0LbVd2dWvcAMXGQGjhDYb6qOz25wwk9M/HcltVpL4FyIEYDHrCzyv0qMsS97InbFpNE3r7pyOM8gPkjBUdT7hZ2QIxAbBIQ1Cu5k93ExiRiI3HRPtFZ7zeeZjIblNty7HSSJtosY+mAO4Rk1oxO8vdn0QtKnA5YJbyfSRSoDOYnhPpDFSVBgsYYiRTlD0AXEBok8BK0Oz7JcF5+eg3fuo5s0catlsOJ5HSA7NswuBvd0EZn4DMq4ptosAvtvkjAYj0yUVZ4dhJA0aJk81E/uR7jeZxPReXk8nJk91/h6cPGxx72EutjGRdosb4T80/+JVXYNnmGyB4quFubPvnjcEeiJbaqUwX2hu/H5gQotN9leKXSCHWqu0jGod8MwP8AbCMs/tI5jSKlMluXulnOZwPRR2aiDjStTgTo+R6HHwXVHW2nkWVN0FpMcQWgnonivwnKn2d/B7FaZdTvMOZunL9JlVG1PZd1NpdScKrYkxg8Di3Xoi3WmnUdDw6zVfxMBDZ/MzTmEytbbVZ+9UDatL+ZT3cXNxB5rqhnyLp2c0/Hg/6MsAodmOAFQfmWyrChbG3sA4ffbg4br7Tnz9FjHWZ9GpVY8QZBG5w0I3hd2LNHJr2ceXDLH30bf2AoA1HOOgC0/tZs77RQc0e8MW8wsL7E7TDKhBOYPiFFtf8A6jVWuc2mwCCRJ4cFdxtUcqlxdlTRBDix4IOoKMsbLpO4rL2nb9R9Q1KmJJ0wVvszb9N+BwK4p4ZR9HZHNGS7LV7JERqibPmcYCjp1Q4S0p7aWHNRaorYX9ppfiXIH7I1IhbMZu0VoJAcbuk5wpLFae2eKc4cPdHGFUP2bVcZe74o6w2qlZ8Jgr1VFf6cDky+tGzyw3RBjLSeSBe5zTBkFXOydpNtAiReae7vLdymFlLi6WBzQYxzCbgBSM7UeTmZUZK1T/ZjtGF9IERmM4WZtVndTeWPEEJGqHTsRjZUhaQE2i7VTMdglCOsjdVJaBwUVEmRuVjRotvXnAkDwPA+STJNQXJlMcHN8UH2NwpMa1re+4Z5dXHQJajXTnPE4DpwXMcQC85nE6cuiSnQc4S+TOmXSPongvDnLk22e3CCiqRFSBfIpGTq6MBxGk9UrLExplzhPRzj+p2A6BHdi53dBDWjUYDikpUqTMm3oze44eJz6JeQQQVqZMCXHgXE+UKV1nDs2vH6HfLFHCsdJjhDAPikaX5h88C9snyhbkBoqXtY3AXgdJgHww9FMLY+mBBvDMjd4qzqWggQ/DL3mX2Y7xiCP6SEps9J4xbcI+9SOHVhxj6lMhWxlHbNKoLlVoOk5kcicUDae0sj71JxdSdgJMtdObXDfxUG1KHZiKgBYfdqsGpyvD64ShLFbzTPZVe8x/g4aEHerxTrZJ16Jto0WhotdllmPfYMmnIwNOWWKKsm1aNdsVmMiMMMGnXDMDkmWUdk5096g/B+t2cA4j13FZq2UzZa1yZacjoQciqcXLrsS10+ix2rsf7OO3oOJaD3m5lv5mkZjeqDajG1HdoML2fA7+S12z7fIA3iPDAn0WQ2rUFnruYf+N0OEZsnMcpBXZ4uaUrjLs87y8Cj9olZUpaKN1jLQHAgzuzCtXWWRfpw9vDTpooTTBy8NV2cqOKrILPbarMnEq5svtGR7wKpjTcMsQuka4KcscJDxzZI/wBmm/1GxcszdC5J/wA8f0f/AKpfhotp0Ja4Dcso2zl7iWiWt3rc1qQqMw1CoOydPZtbEiHGN2RldGN0JPZJsGqwABhuvkSeC1wtBqRDsR7zBm4aEcV55Ta6mYukODsD11XpmxaDajA+QXmACBDgRoqyXsWJYeztsqUy9rqbg2oZa4iMBnKy3tlaW1LQ4t0AB5helNqAe+AGtb6heU7aLTWqFmRcVGTKxRX05ngiHDBRUyJT3jFIOEWTAgdVdWVhcDxMxwGnjHis7eV97PulknfHQYlcXmp/HZ2eE/5KLB7GxLzg0T13/Wp4JA8mBkTnpAOQ5nMpKzcWg+62Xv5/db4+iiuYFx1MdTn5YeK8pI9Wyeme0gDEaDfGp4fWqnJAcGiHu8GhRFxZSgYF3Q3Rh4k+oU1gpBveP1xWaQLCX0QB3+8d3utb8yhzXoTDmNAx0PwhM2hbQxt+Z3DQc/LxWdqGQKr3kXiQ0YmeMDIIwg3sVs1VFtItlj3N4tcXNHNrsfNV1ptbGPDXwJ92pT35nD7piDHqqOjagWhwwxh3GcMtyBrPD71J2YyOoIxEf3eKvHHb2TbrZtXV2FpaQ1wcO80e66cyNx1+pWOtlPs3OoOMj3qbtccj5QeSisW1XNDAcYw+vHzK7bbpYx+oJHiP2n9StCDjKmSbTVk1h2o4NuOOGLSN8/Xmhtp1r9CD71IxM4lpyw5jzVWa3eJ5HxUrbRJeDk5sHXkuhY6dkXO9Flsi2wGzo74YqL25pBwpVRgYLSJzGYPTHxQViqQG85Xe1FoLwz8oI+vBHHGsyonm3jZR2a1PpmWOLTw+IVozbbH4VqeP4mYHqFTBIvQpHml+y47/AI6gPB3dKWpSdq0+vos9dUtO01G+69w6oOAC27MbvJcq7+KVvxnwCRDgzHouzmB1IQQc5jiqk0RSquF8iRk7fvBKMs1pFFrnXTLzLaYGMRGWieatSsMLORxfAARp2/wcprJUvMNOb9Qk56ddy2/sa0UyL4uAHfM9Vm7L7PU7xNR5vHGGktA5QltjKFLOs8j8N84ouUerAkz0T2re00nva77sYHAryxqJqbadWbcbIpjfr4oYKbZWKFotkqR9PFR0TiinOBSjA/YyrfYLobd4k+Ij4IJsBLZa9wyoeRB5MbSLePNY8ibNBaKkF26ac8heKgq1BA/qkeE/FDi0tcCRmQPKfgT4IVlbuQc2x1gx6EeK8dRfR7CkiztdQkU+gKIc8loGWHoP2VR9rDhAOIxHwPl6hEPtuAI3ZccZHqs4sNibd7wujRrY/T81UV3mpTYG4FmB5Yx5J9std7XvTIO/gVVWu2BpHdg68T8F1YsbdEZySJ7RaG0o1y7o1I15KtdayXF2pKitlQu0jqhaLl248SSt9nJPJug42gCB1Ute0F1Mk6ubHQEKsGJkrn15gaBP8asn8miS9jKlY4Qc5QlOpJwT31QE7j6E5ewqg4lwA+t6Kt/eAygZAIOwvDsRM71amh3cUYwSdksk21SM5VooctVzaaKBfTwVkzncQMJ8J5Ykuo2KhkLk6EqwTZ2Hb9novOBcdXYuPim232tc/Ckw8zgqCnSEouzDBTY6Q1wrVDedUInQYIuxbPaJLhJ44pAibOcClbKRSFeICjDl1R6jAWQGOJStJSOClpomFYTCRi6rXa1uJAA1VYbbUqm7RBA1efgFlsz0Wds2gykBeOOgGLj00QtldaKzpAuM44k8yp9n7FYzvVDefxxVk+rAgYJXCD7Q6nNdOiA2GMnGeAGuaeLK+Pfkf05xyR1kax0CHAnEEg4ngrD7IMNZzXk5c1vSo9bHjaX2dsx9ts9WJaAfJUNs7TM49SVv7bQAJEGMcDv19FS2qyTMDLLcd4XRgz12iGaDfsxjq5O9KysRkjNp2As7wHdPkULZ2SV6alFxtHmNTUqZ3anVOom8QAJJV9Y9kB7Zz05HRWLPZY++0Q5uY0P1vUfnhdFvin2VJ9nK4bMtjPAkn0Qts2JUp4xeGv8AhbmwWnuxUYWkdcuWKHqbSoOwBJ5NPxTrIu7EcJPRmNk7QpNaKdRhEZOb7w/qBzVlaaDiLzCHs3t05jRE23YTaovBpHGCFRustos5vMJjhn1GqZNS6JtSjpi1pQ1QI+ltOlVwqt7N/wCNow/Uz4hLa7A5ovCHs0c3EddyIvZUFiQU0a6jhKj7NCw0C9klRXZpFrNRKw58iiaaHGSJptSsZEzFKx0NKgmAnXu6lY6OJShROeAJJQNp2lGAz4Zn5JhSxq1QEDU2nPdYLx/tHM6oRtB9TF5ut3fNG0S1nuhbS7Ck30OobOLzerOncMgOitWVGtENgBVJthTqVQuIG8oN+2FL0i4p1HOyGSVlN0gmCNRvRNg7hDHMicjv4zqj7XZonDdHXgvOy+VK6XR6OPxYpJvs6yWxjzBwOkZg5YSrBveaZzHvcfzD5c1kzepvD444ecrY2GoHNbUAzw9P2PiuScePXTOpSsBtL57xEjM/P1QfZCCQcDIHEAA/Eea0NekAbsCHAExvMAjxE/qQNqFMtIJgg5chw4Qrwjo55y2VZ2WyqLpAx+WBB34LIV9lFhcW4lmY3jhx+S3D6sBoEiYx3Y5c0Ltek1r21RkcH78demfUq2LI06JTgnsrNkVboBHuu0+vVamwE++y8WuwcBid4w4wFk67OygCbhc6ANOXmOisrDanAENMHDHPitOPtBg/RpbXZgSCBBGsROkHeN6qNqbBY+9Upjs6jcXM0dy4onZ9uq1WntMmfeEyNTI13osWgPi46SBjAkbsYyHNBSM40UGz9uPDQHYgHMe8Izw+Ct61mp2hpqUy07xr1b90qm21R7Ks2q0XQ/3hOAdvnjuPxR9Da5c2AGBx915E9JBwTJuO0BpS0yj2nsBjpkQ5UQoWiymWEkajMHmMit1StDXwHmOO6Mwd/DkUtq2fG4gz5Lsx5lJHHkwcTHUdqUashzRSec490nlomPoEbiNCMQeqstpbDY7MdQqSrSq2Uz79I/WPzVaXojtdk3ZLk/8AjNm/A/xC5AIMxskdUSwQoKbhPQfNTgoMyJTiENarWGtiRz0/dQ2q0i5gTiSIynruVaGTi4zw0Cyj7C5VpD3VXVDh4n4DRSUmNZxO9MdUjAKMko9mWuwmpaVGaigLVPZKJe9rd50Q0lYdydElnpueYY0uO4Cf8LQ7N2Uaf+44y5uTYw18YwVxsuiGsAa26BgRkZGckZ5gyleQXRrEePPovOy+TKf1Wkeji8ZQ3LbCrNFenLen5XDD64FSsxY0nSQUD7P92rUpk5gOHEjB3WCFZ3LpdH4gY5xPouGUak4nYnasz+12uY6RzUvs/a6hLmgzlAPWfh4om3N7rmnQlUlktHZVGu/C5XiuUK9k3pm5puvhjs5w5ZH/APMdVTW4d4A748HFvpAVkHXZDThN7oMY8IVRtYYjHMFxjLEgjHqtiEyIiruIEHOZPP6hOrXXtB67uDh4ygdpVdZmcz/UATygnzTLDVvMI4kccRiqtUrJJ+h9R4fSdSIEsOB1LTiDzghAWO0lriCcZj4hR16haWuEz7p+GHiq+0m7UwETB+PzHRXjG9EpSrZpKdofH+24guMYGNP3UllbTaXS5zX5Fkm6TmcRjBVNZ7RjnqPrzXVKvfknPXep8aH5WXb7dLS0iWPEY456Y6hZms808LxwzB37+qsKDhfMuIGYG/fmgduUxN4GRkTvGh+CpjX2r9BJ6v8AAqx7SLmlpjAzJ0+o80cNvOFwHEZg64ZjlCzFkqXSeIRrQHlrdb4A/Vh8k7x1LQnyXHZtzDhiMCg7VZRBG/ejwAAmGCuk5DM/wClwSLR36X4x4pEbYvFGJo6nifLBOtjopnwVt/pm1sGNnqdBe55FVu07O5jYexzDuc0t9UL2b0A21oFyPwN8xePqoQpmtvN4jLiPmFFAzTNmihkJHBS9mmuCCCyNW3suya0/hHmcPmu2TsU1BfcYbzxPP8qvGhoAZAaQRgMMiuXyMypwR1+Nglamy6oth7uLQ71afRqGrtGERmD0+giqzw2CdGkc9fVVRrEsLjgZJ8v3XnRTo9CT2PpWgC00j/U3rB8Ve2owXHS6PI/usjYTNopxiGufPg6FqNp1SSGj8MfFHJGpL/AQemVdsqzJ/EAeowKz20eGo81cu7oAJyc4eP0VntoP70LowR+xLJLRt9n1S6kx0iSw55YaSo9pVAQxw1aJ6f4QOw7STSYODgOYn66Iy2PH2cToRMbjj8FGuMh3uJSWjA3T94DzbLfl1Q+z6kPOMYTzJXWy2lz77jjLcuEIMvgzwPwIXWo2jlbpk9udJcN4/wAfFVVarea064jwRdqfLgfregapz5q2NaRKb7JLNWJIRtZ8qraIPmpTaCmlC3oEZa2WFLaDgInA5g5HDPmnWh4c3nIPWSPDBV2gSVLQA2N/wM/BL8e9B512R08Ff+ylnBc57vuxHMzj4eqybq5kxqtb7P14Y1okndz9AruNdnMsiekaWrXEZqrt+0BTbeqd1ujfvv4flH1gg9qbaZRwEVKv9rP38+SyFrtbqji55JcfqBuCaMRJSov/APVI/wDTs8vkuWcgrk/FCcj3yz2071Z0arXiHtDmnMHEeC8os/tXl34x1BHqtJsr2saTjBG8H5Liaa9HSX21f+nlktALqI7F/wCTBs/0ZeELzH2h9nq9jfFVuByePdd8jwXsmytp06gBa4H1R21rCy00nU6jbwI68COPFGM/0DR89NEprmovbllNltD6Ls2nA6OacWu4SNN8odrw7mrULyLnZm0S1oZAgZATMfUo3sQ6qCPd38B/lUFkMHACcseCvLPUiDOk+K83MuL0evilaRZbQc28CTgBMaHE6aQPRUNothdG4RPGYC602u9exwEDoqyrWxA0w8AZTYsYmWew7Ybv99x/K49folae0Olw6/AH0WT2JUxqO1+c/NXhr49XfBTzr+QfE/qAW2r3XH85CptoP/3CirRV7hH5pQNr94HeAfJdWKNM58ki/wBhOIpDHU+c/JG7Sqm5d3iTzH+VW7HqRTHEn4ou01wSQdWmOc/Jcs1/Iy6f0M9UxI8PgpKzpI4+gATrgkl3QfNQXpc3h8c12LZxvRHWfj1Q9U4qW0O7/ihqzoOPBWgiUmSEYeXyUDmE5mEw2hRurEqsYsjLJEJvXRmh61SeCjLiU65GadRom58tIks1KTuGpOQR9Xal1vZ0e6NXfePLcFXVKk8tyizWq9sXlSoUuRFms5OKdRsqu7DZe6enxWcvwyi32B/ZFyuvso3rktjUZC8pKVUtMgkHgoUqZoZSNRsD2hex4BOOhy6H5r2P2Z2127MfeGfLevndrl6j/wBOLQ4uBccCwk9Dn1w6rlywraLJ2iv/AOsFnAtNJwzNMz0eY9SsCKpC0vtztcWm21HNMsYAxpGsElxH6ifBZ6q1XjpJM5m72iez26DJ8d3NWDtoYHvXiRAxnqqB7CE0PO+PrySywxk7L4/IlBUW5tHdO7AIS02jHBBmq5RlxTRxJCz8iy/2XUutvHU+n+EU22+fxKzbbS4CE5tqcpS8e22y0fLSSRZ2iv7w4oWrWkgbgg31iUy8VWOKiUvIs09gtF1oE5YfNPrVpcDuA881madpcNUSzaBgggAn72JPqoS8Z3ZaPlRaosrbVxwO9V/bwM8UNUtTioDJzVoYqVMjk8i3ondacZUNR5KSEoCqkkQcpS7EATmtSgJS6FgJDg6MvFRucmkqWhQkxlzyW6Nd9EbGElG2ay5Kx2bshz8WkHle9bsea0dHYJptvmTgDDSwyOWJ8lKeZRKQxNlN9ljRWVhs1RwIbTccsgePzWhq2dtNgL7O2Ha34cN16CITTXosa4G+8nKC4XeU4E81yvyPxHSsPtlb/Ca/8l/guUv238jv+5v/AJLkPnn+I3wx/TzVKjLFsivV/wCOi93G6Q3/ALjh5qxGxKVHG1WhrT/KpRVqHgSO6zniu9tHKVez7FUrPFOk0uecgPMk5AcStdtfbLLFZzZLO8OquAFaq3JsfcYfHFUlq9o7rDRstMUKZ94gzVqf11M+gVAShxt7Flk1SJ7O7NSucoaeS4uRaFi6RI5QvauvJJWSCxodCcGTl4fLemlJkmAmSBiW4lY+c/HX91OKZ07w3j4jRI3RWNMH7NIWKaVyFjcUQ9mnCmigxLdCHMb40B9ml7FF3QoqlRo4/W9ZSbA4JdkTaROWiaQBx9F1WsTgct2iks1gq1DDGOPT4lP1tk2/SIM8o6kD1RdnsBcR3HGdz2DwkK+2HsCsQQZaBmbrGgZ5OfmenJW9OzUmjFxEHGS1zncoGHooZPIS0h4YXLbM9ZthSJ7Op/ZP/wBmPgtNQ2FcZ2r2GP0Bx4wG3gOqEr7ZaXgUad05e8XRxyzUNe1VqkzUgDCXOiOhMrnlOci8YQiXdN9BnedJgSGFznY6G/iY4BAnbLRUPZ4HE4TdbyLsh06qoc9oht5zzmSBn1KU97u06ZdwEvPW7dHiUFivsZ5Eug207Sc/vGRxnE8ifd5jFTbOsptLp7w4zIH6i26Dzcidl7OdLTVpMAwAAuuf1BgNGW9Xu0Xmk0OpXe5JvS2MMAGm6MeIEYHFBtLSMrfYD/o9v8z++l/5rlN9sqf+qd/21vmuQtmpHmVs2zaKv/JWqOG4uMeAwVelKW4ceC9To8vsYuAT3QMsf8LqbZMrBSHphUhTHBAcYkJSpCiY4FKEgCULGOhS0apGRgprUpZ9dP8ACDCtBbK4ODmg8R3Soy5oyPiPkhrxTb6XgP8AIwk1uI8D8QmGuUPeXSjxQHkZK+qTmUtnpF5gAn+kSfDdxUICKDycB3RuGE8zmeqz10LybNPYrDZ6bf8AdMuOlNwdEbyDgd4hHVNrU6YuUmho3kBx8dFm7G4NbJlzjIxOW4/slNpuiNczO/TDd+65JY3J7OmM1FaLW07YqPF2cORx6a+CCqWiPedPWOk6DlKrKlsMQPrehiSVSOFLsSWZll/EovAYTuwHAE5uHVIysMJcGjQReceTRl1PigbPZy4kYdSAMt5V7snZ7nG615jV1NtwDH71dwEJpKMQR5SG07LVMXaN0E+9WOJn/wBsRj0J4rV2CyigW9tULnYkNLXgDD+U0icJ96R6J2zNmim0upMBzmrJgR7x7Uw926GCCcJS2z2ibSZUb2XZi81jMgXXgHPe6cjiCeglckpubpHTGChthNvtVIioLwc5pawnuwx5kkANaG4QdM53LJW/2iJa0F14ueXHD7re61ka+6DPHgVWbd2vfJFMBoJe7DWe6DwN0AeO9A0aJNSPwhwH6Wk+qvDCkrZGeXdII/jlb+cfD9lyj/h53LlbjAlykV8prnJJSKpAWURTOCHaFO1ZjIfCa8KQLoSjEN1MLUQRgmEImIrqUBSELljCNC5+nVPATamY5FA3oQBPayUgCewLBIzSXCmiC1IELNQxlJEU2KNqfigwokvFQvkqRrei4oILIWUZU1OzqWmpg4Qs2ZIK2PZ++67SDoIlzoDB3RhiDPritpYqQAEvEiS4XRDQBhBm60yRgb0DHDJYvZVvZTe97iXFt24yYYCR72ekHCM46Or7dc4l16+QJ3C8T3KbRunE/wBPOebJBykdGOajEvtu7bcxz29oDFy9+Fgbi5oObiQQOZG/DGbStxtFRl44HF0neS53hj0AQNrqOe4yZMkk73Ey4+PoiOzBMgYYADg0AD0V4Y1EjPI5aG0aReSSM/Lgj7NZohJQZCJpnFFsCRJ2ZXJL43pUAmVC4LlyuQHNU5SrkAoeEqRclGOUa5cigMVcFy5YxwXVcxyPwXLljCsTxouXIBJXKJq5cggsc1SOXLkGEdp9cUjly5ZGY+hn1HxS1M/FcuW9mXQHXzPJvoU+zaf/ACUvR65cmfQEQ0EdTXLlpAiEnRczT63LlymUJVy5csY//9k=',
            'Macaron': 'https://images.unsplash.com/photo-1558326567-98ae2405596b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80',
            'Macarons': 'https://images.unsplash.com/photo-1558326567-98ae2405596b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80',
            'Blueberry Muffins': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
            'Fruit Tart': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
            'Éclair': 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
            'Vanilla Cupcake': 'https://images.unsplash.com/photo-1570080174460-7b55858f95f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',

            // Breads
            'Bagel': 'https://images.unsplash.com/photo-1535920527894-b400b62fe660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            'Sourdough Bread': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            'Baguette': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            'Whole Wheat Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
            'Rye Bread': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
            'Ciabatta': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',

            // Cookies
            'Chocolate Chip Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
            'Oatmeal Raisin Cookies': 'https://images.unsplash.com/photo-1558961364-14b302f64c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80',

            // Desserts
            'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            'Panna Cotta': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
            'Crème Brûlée': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80',
            'Profiterole': 'https://images.unsplash.com/photo-1569728723352-5083a1182a8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
            'Mousse': 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1333&q=80'
        };

        // Check for exact product name match first
        if (product && productImages[product.name]) {
            return productImages[product.name];
        }

        // Fallback to category-based images
        const categoryImages = {
            'Cakes': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            'Pastries': 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=400&h=300&fit=crop',
            'Breads': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
            'Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
            'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
        };

        return (product && categoryImages[product.category]) || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
    };

    // Build a Zomato search URL. Prefer lat/lon when available, otherwise use city or query-only search.
    const getZomatoUrl = (productName, lat, lon, city) => {
        const q = encodeURIComponent(productName || 'food');
        if (lat && lon) {
            return `https://www.zomato.com/search?lat=${lat}&lon=${lon}&q=${q}`;
        }
        if (city) {
            // Zomato supports city in path: /{city}/search?q=...
            return `https://www.zomato.com/${encodeURIComponent(city)}/search?q=${q}`;
        }
        return `https://www.zomato.com/search?q=${q}`;
    };

    // Open Zomato search in a new tab using browser geolocation when possible.
    const openZomatoOrder = (product, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const productName = product && product.name ? product.name : 'bakery';

        const openWith = (lat, lon, city) => {
            const url = getZomatoUrl(productName, lat, lon, city);
            window.open(url, '_blank');
        };

        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    openWith(pos.coords.latitude, pos.coords.longitude, null);
                },
                (err) => {
                    // If geolocation fails or is denied, ask for city as fallback
                    const city = window.prompt('Enter your city to search on Zomato (or cancel):');
                    openWith(null, null, city);
                },
                { timeout: 10000 }
            );
        } else {
            const city = window.prompt('Enter your city to search on Zomato (or cancel):');
            openWith(null, null, city);
        }
    };

    if (loading) {
        return <div className="menu-container"><div className="loading">Loading menu...</div></div>;
    }

    if (error) {
        return (
            <div className="menu-container" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ color: '#dc3545', marginBottom: '12px', fontWeight: 700 }}>{error}</div>
                <div style={{ marginBottom: '16px', color: '#666' }}>The front-end could not reach the API.</div>
                <button
                    onClick={() => { setLoading(true); setError(null); fetchProducts(); }}
                    style={{
                        background: 'linear-gradient(135deg, #d2691e, #b8571f)',
                        border: 'none',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="menu-container">
            <h2 style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '3rem',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6347)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animation: 'glow 3s ease-in-out infinite alternate, fadeInUp 1s ease-out'
            }}>Our Delicious Menu</h2>

            <div className="menu-categories" style={{
                animation: 'fadeInUp 1s ease-out 0.3s both'
            }}>
                {categories.map((category, index) => (
                    <button
                        key={category.id}
                        className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                        style={{
                            animation: `zoomIn 0.8s ease-out ${0.5 + index * 0.1}s both`
                        }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="menu-grid">
                {filteredProducts.map((product, index) => (
                    <div key={product._id} className="menu-item" style={{
                        animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                        cursor: 'pointer'
                    }} onClick={() => handleProductClick(product)}>
                        <div
                            className="menu-item-image"
                            style={{
                                backgroundImage: `url(${getProductImage(product)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        ></div>
                        <div className="menu-item-content">
                            <h3 style={{ fontWeight: '600', color: '#333' }}>{product.name}</h3>
                            <p style={{ color: '#666', marginBottom: '15px' }}>{product.description}</p>
                            <button
                                className="add-to-cart-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openZomatoOrder(product, e);
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #d2691e, #b8571f)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                    boxShadow: '0 4px 15px rgba(210, 105, 30, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(210, 105, 30, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(210, 105, 30, 0.3)';
                                }}
                            >
                                Order Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-products">
                    <p>No products found in this category.</p>
                </div>
            )}

            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={closeModal} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        animation: 'zoomIn 0.3s ease-out',
                        position: 'relative'
                    }}>
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#666',
                                padding: '5px'
                            }}
                        >
                            ×
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{
                                width: '100%',
                                height: '300px',
                                borderRadius: '10px',
                                backgroundImage: `url(${getProductImage(selectedProduct)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                            }}></div>

                            <div>
                                <h2 style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    fontSize: '2.5rem',
                                    color: '#d2691e',
                                    marginBottom: '10px',
                                    textAlign: 'center'
                                }}>{selectedProduct.name}</h2>

                                <p style={{
                                    fontSize: '1.1rem',
                                    color: '#666',
                                    lineHeight: '1.6',
                                    marginBottom: '20px',
                                    textAlign: 'center'
                                }}>{selectedProduct.description}</p>

                                {/* External product info (Wikipedia) */}
                                <div style={{ marginBottom: '18px', textAlign: 'left' }}>
                                    {productInfoLoading && (
                                        <p style={{ color: '#666', fontSize: '0.95rem' }}>Loading additional info...</p>
                                    )}
                                    {productInfoError && (
                                        <p style={{ color: '#c0392b', fontSize: '0.95rem' }}>{productInfoError}</p>
                                    )}
                                    {productInfo && (
                                        <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <strong style={{ display: 'block', marginBottom: '6px', color: '#333' }}>{productInfo.title}</strong>
                                            <p style={{ margin: 0, color: '#555', lineHeight: '1.4' }}>{productInfo.extract}</p>
                                            {productInfo.url && (
                                                <a href={productInfo.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: '#1a73e8' }}>Read more</a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    backgroundColor: '#f8f8f8',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    marginBottom: '20px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '12px',
                                        paddingBottom: '8px',
                                        borderBottom: '1px solid #e0e0e0'
                                    }}>
                                        <span style={{ fontWeight: '700', color: '#333', fontSize: '1.1rem' }}>Details</span>
                                        <span style={{ color: '#666', fontSize: '0.9rem' }}>{selectedProduct.sku || selectedProduct._id}</span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        marginTop: '10px',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '600', color: '#333' }}>Contains:</span>
                                            <span style={{ color: '#666', fontSize: '0.95rem', maxWidth: '65%', textAlign: 'right' }}>
                                                {selectedProduct.contains && selectedProduct.contains.length
                                                    ? selectedProduct.contains
                                                    : (selectedProduct.ingredients && selectedProduct.ingredients.length
                                                        ? selectedProduct.ingredients.slice(0, 6).join(', ')
                                                        : 'N/A')}
                                            </span>
                                        </div>

                                        {selectedProduct.weight && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '600', color: '#333' }}>Weight:</span>
                                                <span style={{ color: '#666', fontSize: '0.95rem' }}>{selectedProduct.weight}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '12px'
                                    }}>
                                        <span style={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>Category:</span>
                                        <span style={{
                                            color: '#666',
                                            backgroundColor: '#fff',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '0.9rem'
                                        }}>{selectedProduct.category}</span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0'
                                    }}>
                                        <span style={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>Availability:</span>
                                        <span style={{
                                            color: selectedProduct.available ? '#28a745' : '#dc3545',
                                            fontWeight: '600',
                                            backgroundColor: selectedProduct.available ? '#d4edda' : '#f8d7da',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            border: `1px solid ${selectedProduct.available ? '#c3e6cb' : '#f5c6cb'}`,
                                            fontSize: '0.9rem'
                                        }}>
                                            {selectedProduct.available ? '✓ In Stock' : '✗ Out of Stock'}
                                        </span>
                                    </div>

                                </div>

                                {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{
                                            fontSize: '1.3rem',
                                            color: '#333',
                                            marginBottom: '10px',
                                            fontWeight: '600'
                                        }}>Ingredients:</h3>
                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {selectedProduct.ingredients.map((ingredient, index) => (
                                                <li key={index} style={{
                                                    backgroundColor: '#f8f8f8',
                                                    padding: '5px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.9rem',
                                                    color: '#666',
                                                    border: '1px solid #e0e0e0'
                                                }}>
                                                    {ingredient}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '15px',
                                    marginTop: '30px'
                                }}>
                                    <button
                                        onClick={() => {
                                            handleAddToCart(selectedProduct);
                                            closeModal();
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, #d2691e, #b8571f)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '15px 30px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 15px rgba(210, 105, 30, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(210, 105, 30, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(210, 105, 30, 0.3)';
                                        }}
                                    >
                                        Order Now
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        style={{
                                            background: 'transparent',
                                            border: '2px solid #d2691e',
                                            color: '#d2691e',
                                            padding: '15px 30px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#d2691e';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = '#d2691e';
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
