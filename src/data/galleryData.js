// src/data/galleryData.js

// src/data/galleryData.js

const photos = [
    { type: 'image', src: "/canva/h36.jpeg", title: "Living Room" },
    { type: 'image', src: "/canva/h35.jpeg", title: "Structural Excellence" },
    { type: 'image', src: "/canva/h38.jpeg", title: "Modern Kitchen" },
    { type: 'image', src: "/canva/h12.jpeg ", title: "Cafe Renovation" },
    // Yeh hamara naya 'blank' cell hai
    { type: 'image', src: "/canva/h21.jpeg", title: "Commercial Building" },
    { type: 'image', src: "/canva/h8.png", title: "Classic Interior Makeover" },
    { type: 'image', src: "/canva/h13.png", title: "High-Rise Construction" },
    { type: 'image', src: "/canva/h6.png", title: "Corporate Office" },
    { type: 'image', src: "/canva/h9.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h10.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h11.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h4.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h7.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h14.png", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h15.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h16.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h17.png", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h18.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h19.png", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h20.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h5.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h22.png", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h23.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h24.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h25.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h26.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h27.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h28.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h29.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h30.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h31.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h32.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h33.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h34.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h2.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h1.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h37.png", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h3.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h39.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h40.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h41.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h42.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h43.png", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h44.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h45.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h46.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h47.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h48.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h49.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h50.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h51.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h52.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h53.jpeg", title: "Industrial Warehouse" },
    { type: 'image', src: "/canva/h53.jpeg", title: "Industrial Warehouse" },
    
  ];
  
  // Lightbox ke liye humein sirf image objects chahiye
  export const imageSlides = photos.filter(p => p.type === 'image');
  
  export default photos;
   