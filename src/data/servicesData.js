// src/data/servicesData.js

export const services = [
    {
      slug: 'modular-furniture', // Pehle se sahi hai
      title: 'Modular Furniture Solutions',
      // ... baaki details waise hi ...
      tagline: 'Precision-engineered solutions for every sector.',
      imageUrl: '/ChatGPT Image Jun 16, 2025, 05_45_00 PM.png',
      description: 'Our modular products are manufactured in-house...',
      subServices: [
          'Educational Institutions: Desks, labs, libraries, staff rooms',
          'Corporate Offices: Workstations, partitions, conference rooms',
          'Hospitals & Labs: Modular OT, diagnostic counters, lab storage',
          'Retail & Commercial Spaces: Display units, counters, fitting rooms',
          'Homes & Apartments: Modular kitchens, wardrobes, TV units',
      ],
      // BADLAAV YAHAN HAI: Ab yeh projects ki ek list hai
      galleryProjects: [
        { title: 'Modern Kitchen', images: ['/w23-pf-CompactModularLshapedKitcheninEarthCherrycolour1.webp', '/pexels-the-ghazi-2152398165-32178151.jpg','/pexels-perqued-11262210.jpg','/pexels-heyho-6489104.jpg'] },
        { title: 'Living Room', images: ['/pexels-houzlook-3797991.jpg','/pexels-pixabay-259580.jpg'] },
        { title: 'Residential Wardrobes', images: ['/pexels-heyho-6312073.jpg', '/pexels-heyho-6508346.jpg','/pexels-heyho-6527064.jpg','/pexels-heyho-6585768.jpg','/pexels-heyho-6933762.jpg','/pexels-heyho-7214472.jpg','/pexels-heyho-7227619.jpg','/pexels-houzlook-3805129.jpg'] },
        { title: 'Lab Setup', images: ['/pexels-heyho-6312073.jpg', '/pexels-heyho-6508346.jpg'] },
      ]
    },
     {
      slug: 'school-furniture',
      title: 'Durable School Furniture Solutions',
      tagline: 'Creating conducive learning environments for the future.',
      imageUrl: '/school-furniture/school_main.jpeg', // **Replace with an actual image for School Furniture**
      description: 'We provide a comprehensive range of high-quality and ergonomic school furniture designed to enhance the learning experience. Our products prioritize durability, safety, and functionality, catering to classrooms, labs, libraries, staff rooms, and common areas. From sturdy desks and chairs to innovative storage solutions, we ensure every piece contributes to a comfortable and productive educational setting.',
      subServices: [
          'Classroom Desks & Chairs: Single, dual, and group seating options',
          'Lab Furniture: Workstations, storage cabinets, chemical resistant tops',
          'Library Furniture: Bookshelves, reading tables, carrels',
          'Staff Room Furniture: Desks, chairs, filing cabinets',
          'Playground Equipment: Safe and durable outdoor installations',
          'Customized Solutions: Tailored designs for specific school needs',
      ],
      // BADLAAV YAHAN: Ab yeh projects ki ek list hai
      galleryProjects: [
        { title: 'Modular Desks', images: ['/canva/h36.jpeg', '/canva/h35.jpeg','/canva/h9.jpeg','/canva/h10.jpeg','/canva/h15.jpeg','/canva/h16.jpeg','/canva/h18.jpeg','/canva/h20.jpeg','/canva/h28.jpeg','/canva/h30.jpeg','/canva/h32.jpeg','/canva/h33.jpeg','/canva/h34.jpeg','/canva/h37.png','/canva/h38.jpeg','/canva/h39.jpeg','/canva/h40.jpeg','/canva/h42.jpeg','/canva/h44.jpeg','/canva/h46.jpeg','/canva/h47.jpeg'] },
        { title: 'BIOLOGY/CHEMISTRY LAB', images: ['/w23-pf-CompactModularLshapedKitcheninEarthCherrycolour1.webp', '/pexels-the-ghazi-2152398165-32178151.jpg','/pexels-perqued-11262210.jpg','/pexels-heyho-6489104.jpg'] },
        { title: 'Living Room', images: ['/pexels-houzlook-3797991.jpg','/pexels-pixabay-259580.jpg'] },
        { title: 'Residential Wardrobes', images: ['/pexels-heyho-6312073.jpg', '/pexels-heyho-6508346.jpg','/pexels-heyho-6527064.jpg','/pexels-heyho-6585768.jpg','/pexels-heyho-6933762.jpg','/pexels-heyho-7214472.jpg','/pexels-heyho-7227619.jpg','/pexels-houzlook-3805129.jpg'] },
        { title: 'Lab Setup', images: ['/pexels-heyho-6312073.jpg', '/pexels-heyho-6508346.jpg'] },
      ]
    },
    {
      slug: 'construction',
      title: 'Construction Solutions', // Pehle se sahi hai
      // ... baaki details waise hi ...
      imageUrl: '/ChatGPT Image Jun 16, 2025, 05_45_00 PM.png',
      description: 'We take on large-scale civil construction projects...',
      subServices: [
          'New Buildings (Residential, Institutional, Commercial)',
          'Structural Development and RCC Work',
          'Plumbing, Electrical, and all Finishing Works',
          'Handover-Ready Infrastructure Development',
      ],
      galleryProjects: [
        { title: 'Priest House', images: ['/canv2/a1.jpeg', '/canv2/a6.jpeg', '/canv2/a3.jpeg', '/canv2/a4.jpeg','/canv2/a5.jpeg', '/canv2/a2.jpeg', '/canv2/a7.jpeg', '/canv2/a8.jpeg', '/canv2/a9.jpeg', '/canv2/a10.jpeg', '/canv2/a11.jpeg',] },
        { title: 'City Commercial Complex', images: ['/20220117_122222.jpeg', '/20220118_132909.jpeg','/20220118_171319.jpeg','/20220127_153734.jpeg','/20220212_135512.jpeg','/20220217_165200.jpeg'] },
        { title: 'City Complex', images: ['/20220128_153450.jpeg', '/20220128_153444.jpeg', '/20220128_153431.jpeg', '/20220128_153504.jpeg','/20220128_153511.jpeg'] },
        { title: 'Priest House', images: ['/canv2/a1.jpeg', '/canv2/a2.jpeg', '/canv2/a3.jpeg', '/canv2/a4.jpeg','/canv2/a5.jpeg', '/canv2/a6.jpeg', '/canv2/a7.jpeg', '/canv2/a8.jpeg', '/canv2/a9.jpeg', '/canv2/a10.jpeg', '/canv2/a11.jpeg',] },
        { title: 'Warehouse Build', images: ['/gallery-construction-4.jpg', '/trust-team.jpg'] },
      ]
    },
    {
      slug: 'renovation', // Pehle se sahi hai
      title: 'Renovation & Makeover Projects',
      // ... baaki details waise hi ...
      tagline: 'Breathing new life into existing spaces.',
      imageUrl: '/ChatGPT Image Jun 16, 2025, 05_45_00 PM.png',
      description: 'We specialize in revamping old or outdated buildings...',
      subServices: [
          'Interior and Exterior Design & Execution',
          'Structural Changes, False Ceilings, Flooring',
          'Furniture Overhaul and Modern Upgrades',
          'Complete Space Re-planning and Modernization'
      ],
      galleryProjects: [
        { title: 'Heritage Home Restoration', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg','/pexels-kawserhamid-176342.jpg'] },
        { title: 'Vintage Cafe Makeover', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg'] },
        { title: 'Heritage Home Restoration', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg'] },
        { title: 'Vintage Cafe Makeover', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg'] },
      ]
    },
    {
      slug: 'solar-panels', 
      title: 'Sustainable Solar Panel Solutions', // Title updated
      tagline: 'Harnessing the sun for a greener tomorrow.', // New tagline
      imageUrl: '/solar-panels/solar_main.jpeg', // **Replace with an actual image for Solar Panels**
      description: 'We offer complete solar panel solutions for residential, commercial, and industrial clients, enabling them to reduce electricity bills and embrace sustainable energy. Our services include site assessment, system design, installation, and ongoing maintenance. We provide high-efficiency solar panels and reliable inverters, ensuring maximum energy generation and long-term performance for a cleaner environment.', // New description
      subServices: [
          'Residential Solar Installations: Rooftop and ground-mounted systems',
          'Commercial Solar Solutions: Large-scale installations for businesses',
          'Industrial Solar Solutions: High-capacity systems for factories and warehouses',
          'Solar System Design & Engineering: Customized solutions for optimal performance',
          'Installation & Commissioning: Professional and safe setup',
          'Maintenance & Support: Ensuring long-term efficiency',
      ],
      galleryProjects: [
        { title: 'Heritage Home Restoration', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg','/pexels-kawserhamid-176342.jpg'] },
        { title: 'Vintage Cafe Makeover', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg'] },
        { title: 'Heritage Home Restoration', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg'] },
        { title: 'Vintage Cafe Makeover', images: ['/pexels-kawserhamid-176342.jpg', '/pexels-kawserhamid-176342.jpg'] },
      ]
    },
  ];