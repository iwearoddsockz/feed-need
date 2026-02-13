-- Seed data: Free meal locations in Perth metro area
-- Sources: WAConnect, Foodbank WA, OzHarvest, Salvation Army, St Pats, Red Cross, and others

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'St Patrick''s Community Support Centre Day Centre',
  'St Patrick''s Community Support Centre',
  'Fresh-cooked meals twice daily. Offers free breakfasts and subsidized lunches with gold coin donation. Fresh fruit, bread and groceries available daily. Self-serve café style courtyard with additional facilities.',
  '52 Adelaide Street',
  'Fremantle',
  '6160',
  -32.0569,
  115.7439,
  '08 9335 5985',
  'https://stpats.com.au',
  'Anyone welcome - no referral needed',
  false,
  true,
  true,
  now()
);

-- Schedules for: St Patrick's Community Support Centre Day Centre
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'monday', 'breakfast', '07:30', '09:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'monday', 'lunch', '11:30', '13:30', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'tuesday', 'breakfast', '07:30', '09:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'tuesday', 'lunch', '11:30', '13:30', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'wednesday', 'breakfast', '07:30', '09:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'wednesday', 'lunch', '11:30', '13:30', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'thursday', 'breakfast', '07:30', '09:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'thursday', 'lunch', '11:30', '13:30', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'friday', 'breakfast', '07:30', '09:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Patrick''s Community Support Centre Day Centre' LIMIT 1), 'friday', 'lunch', '11:30', '13:30', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Tranby Engagement Hub',
  'Uniting WA',
  'Drop-in service providing free breakfast every morning, along with showers, medical services, and support services including Centrelink, mobile GP, and street lawyer.',
  '6/5 Aberdeen Street',
  'Perth',
  '6000',
  -31.9505,
  115.8605,
  '08 9220 1288',
  'https://unitingwa.org.au',
  'Open to people aged 18+ experiencing homelessness or at risk. No referral required.',
  false,
  true,
  true,
  now()
);

-- Schedules for: Tranby Engagement Hub
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Tranby Engagement Hub' LIMIT 1), 'monday', 'breakfast', '07:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Tranby Engagement Hub' LIMIT 1), 'tuesday', 'breakfast', '07:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Tranby Engagement Hub' LIMIT 1), 'wednesday', 'breakfast', '07:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Tranby Engagement Hub' LIMIT 1), 'thursday', 'breakfast', '07:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Tranby Engagement Hub' LIMIT 1), 'friday', 'breakfast', '07:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Tranby Engagement Hub' LIMIT 1), 'saturday', 'breakfast', '08:00', '11:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Salvation Army Perth Fortress Corps Community Meal',
  'Salvation Army',
  'Monthly community meal with worship service. Warm, welcoming environment with hot meal provided.',
  '333 William Street',
  'Northbridge',
  '6003',
  -31.947,
  115.8612,
  '08 9260 9591',
  'https://www.salvationarmy.org.au',
  'Anyone welcome',
  false,
  true,
  true,
  now()
);

-- Schedules for: Salvation Army Perth Fortress Corps Community Meal
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Salvation Army Perth Fortress Corps Community Meal' LIMIT 1), 'monday', 'dinner', '17:30', '19:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Salvation Army Street Outreach Service',
  'Salvation Army',
  'Night time mobile street outreach providing hot meals to homeless people at various locations around Perth starting around 11pm.',
  'Various locations around Perth CBD',
  'Perth',
  '6000',
  -31.9505,
  115.8605,
  '08 9260 9591',
  'https://www.salvationarmy.org.au',
  'Homeless and rough sleepers',
  false,
  true,
  true,
  now()
);

-- Schedules for: Salvation Army Street Outreach Service
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Salvation Army Street Outreach Service' LIMIT 1), 'friday', 'dinner', '23:00', '01:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Street Outreach Service' LIMIT 1), 'saturday', 'dinner', '23:00', '01:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Street Outreach Service' LIMIT 1), 'sunday', 'dinner', '23:00', '01:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Seeds of Hope Services',
  'Seeds of Hope Perth',
  'Providing meals, food parcels, clothing, blankets and toiletries for homeless and needy since 1994. Warm nutritious meals served weekly.',
  'Moore Street (next to Royal Perth Hospital)',
  'Perth',
  '6000',
  -31.954,
  115.8618,
  '0487 996 147',
  'https://www.seedsofhopeservices.com',
  'Homeless and people in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: Seeds of Hope Services
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Seeds of Hope Services' LIMIT 1), 'monday', 'dinner', '16:45', '18:30', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Red Cross Soup Patrol - Perth',
  'Australian Red Cross',
  'Mobile van service providing hot soup, bread, and fruit to vulnerable people at designated stops around Perth every night of the year.',
  'Various locations in Perth CBD',
  'Perth',
  '6000',
  -31.9505,
  115.8605,
  NULL,
  'https://www.redcross.org.au',
  'Anyone in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: Red Cross Soup Patrol - Perth
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'monday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'tuesday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'wednesday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'thursday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'friday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'saturday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Perth' LIMIT 1), 'sunday', 'dinner', '19:00', '21:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Red Cross Soup Patrol - Fremantle',
  'Australian Red Cross',
  'Mobile van service providing hot soup, bread, and fruit to vulnerable people at designated stops around Fremantle.',
  'Various locations in Fremantle',
  'Fremantle',
  '6160',
  -32.0569,
  115.7439,
  NULL,
  'https://www.redcross.org.au',
  'Anyone in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: Red Cross Soup Patrol - Fremantle
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'monday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'tuesday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'wednesday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'thursday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'friday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'saturday', 'dinner', '19:00', '21:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Red Cross Soup Patrol - Fremantle' LIMIT 1), 'sunday', 'dinner', '19:00', '21:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Midland Meals Inc',
  'Midland Meals Inc',
  'Prepares and delivers over 870 nutritious meals each week to homeless and those in need across the Midland area. Operating from white container in council carpark.',
  '56 Morrison Road (Council Carpark)',
  'Midland',
  '6056',
  -31.8891,
  116.0089,
  NULL,
  'https://www.midlandmealsinc.com.au',
  'Homeless and those in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: Midland Meals Inc
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'monday', 'dinner', '18:00', '19:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'tuesday', 'dinner', '18:00', '19:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'wednesday', 'dinner', '18:00', '19:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'thursday', 'dinner', '18:00', '19:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'friday', 'dinner', '18:00', '19:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'saturday', 'dinner', '18:00', '19:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Midland Meals Inc' LIMIT 1), 'sunday', 'dinner', '18:00', '19:30', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Ruah Engagement Hub',
  'Ruah Community Services',
  'Drop-in service providing light packaged meals and snacks, beverages, clothing, and essential toiletries. Safe and accepting environment with support and advocacy.',
  '10-12 Fitzgerald Street',
  'Northbridge',
  '6003',
  -31.9485,
  115.8598,
  '08 9205 2500',
  'https://ruah.org.au',
  'People experiencing homelessness. No referral required.',
  false,
  true,
  true,
  now()
);

-- Schedules for: Ruah Engagement Hub
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Ruah Engagement Hub' LIMIT 1), 'monday', 'food_parcel', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Ruah Engagement Hub' LIMIT 1), 'tuesday', 'food_parcel', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Ruah Engagement Hub' LIMIT 1), 'wednesday', 'food_parcel', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Ruah Engagement Hub' LIMIT 1), 'thursday', 'food_parcel', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Ruah Engagement Hub' LIMIT 1), 'friday', 'food_parcel', '08:30', '14:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Passages Youth Engagement Hub',
  'St Vincent de Paul Society WA',
  'Safe space for young people with food, showers, laundry, computer access, and healthy cooking programs. In-reach services including Centrelink, healthcare, and street law.',
  '25 Pier Street',
  'Perth',
  '6000',
  -31.954,
  115.8591,
  '08 9228 1478',
  'https://passages.org.au',
  'Young people aged 12-25 years at risk or marginalized',
  false,
  true,
  true,
  now()
);

-- Schedules for: Passages Youth Engagement Hub
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Passages Youth Engagement Hub' LIMIT 1), 'monday', 'lunch', '11:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Passages Youth Engagement Hub' LIMIT 1), 'tuesday', 'lunch', '11:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Passages Youth Engagement Hub' LIMIT 1), 'wednesday', 'lunch', '11:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Passages Youth Engagement Hub' LIMIT 1), 'thursday', 'lunch', '11:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Passages Youth Engagement Hub' LIMIT 1), 'friday', 'lunch', '11:00', '15:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Salvation Army Rockingham Drop In Centre',
  'Salvation Army',
  'Drop-in centre with Higher Grounds coffee bar providing coffee, hot beverages and light meals. Free bread available. Food hampers for those in need.',
  'Corner Read Street & Willmott Drive',
  'Cooloongup',
  '6168',
  -32.285,
  115.753,
  '08 9527 3460',
  'https://www.salvationarmy.org.au',
  'Anyone in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: Salvation Army Rockingham Drop In Centre
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Salvation Army Rockingham Drop In Centre' LIMIT 1), 'tuesday', 'lunch', '09:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Rockingham Drop In Centre' LIMIT 1), 'tuesday', 'food_parcel', '09:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Rockingham Drop In Centre' LIMIT 1), 'wednesday', 'lunch', '09:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Rockingham Drop In Centre' LIMIT 1), 'wednesday', 'food_parcel', '09:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Rockingham Drop In Centre' LIMIT 1), 'friday', 'lunch', '09:00', '13:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'HavenWell',
  'The Haven Centre Inc',
  'Provides 30 cooked breakfasts, up to 200 meals a day and 25 food hampers for emergency relief. Hot meals, showers, and hygiene materials available. All services are free.',
  '879 Albany Highway',
  'East Victoria Park',
  '6101',
  -31.985,
  115.895,
  '0438 273 620',
  'https://havenwellwebsite.wixsite.com/my-site-1',
  'Perth residents in need, homeless and rough sleepers',
  false,
  true,
  true,
  now()
);

-- Schedules for: HavenWell
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'tuesday', 'breakfast', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'tuesday', 'lunch', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'wednesday', 'breakfast', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'wednesday', 'lunch', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'thursday', 'breakfast', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'thursday', 'lunch', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'friday', 'breakfast', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'friday', 'lunch', '08:00', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'HavenWell' LIMIT 1), 'saturday', 'breakfast', '08:30', '13:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Grace Anglican Church Cafe',
  'Grace Anglican Church',
  'Grace Café provides cooked and home-prepared meals for community members who are homeless, in insecure housing, or looking for social interaction.',
  '109 Grand Boulevard',
  'Joondalup',
  '6027',
  -31.7467,
  115.7657,
  '08 9300 0418',
  'https://www.joondalup.perth.anglican.org',
  'Homeless, insecurely housed, or anyone seeking social interaction',
  false,
  true,
  true,
  now()
);

-- Schedules for: Grace Anglican Church Cafe
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Grace Anglican Church Cafe' LIMIT 1), 'monday', 'lunch', '10:00', '12:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Grace Anglican Church Cafe' LIMIT 1), 'thursday', 'lunch', '10:00', '12:30', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'The Pantry WA',
  'The Pantry WA Ltd',
  'Provides pre-packaged food hampers to Perth residents suffering food insecurity. Two days a week residents can collect food parcels.',
  '7 Lumsden Road',
  'Wangara',
  '6065',
  -31.795,
  115.835,
  '0492 955 712',
  'https://thepantrywa.com.au',
  'People experiencing food insecurity and homelessness',
  false,
  true,
  true,
  now()
);

-- Schedules for: The Pantry WA
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'The Pantry WA' LIMIT 1), 'wednesday', 'food_parcel', '10:30', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'The Pantry WA' LIMIT 1), 'saturday', 'food_parcel', '10:30', '13:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Salvation Army Doorways Merriwa',
  'Salvation Army',
  'Food hampers, free toasted sandwiches, tea and coffee. Also provides clothing, furniture vouchers, and access to fresh produce boxes from Foodbank.',
  '26 Jenolan Way',
  'Merriwa',
  '6030',
  -31.668,
  115.719,
  '08 9305 2131',
  'https://www.salvationarmy.org.au',
  'Anyone in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: Salvation Army Doorways Merriwa
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Salvation Army Doorways Merriwa' LIMIT 1), 'monday', 'food_parcel', '09:00', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Doorways Merriwa' LIMIT 1), 'tuesday', 'food_parcel', '09:00', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Doorways Merriwa' LIMIT 1), 'wednesday', 'pantry', '11:45', '13:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Doorways Merriwa' LIMIT 1), 'friday', 'lunch', '09:00', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Doorways Merriwa' LIMIT 1), 'friday', 'pantry', '11:45', '13:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Foodbank WA Perth Branch',
  'Foodbank WA',
  'Food assistance for those who struggle to afford groceries. Wide variety of hampers including meat, dry food with pantry staples, and fresh produce at very low cost. Requires phone referral first.',
  '23 Abbott Road',
  'Perth Airport',
  '6105',
  -31.945,
  115.963,
  '08 9258 9277',
  'https://www.foodbank.org.au/wa',
  'Referral required - call 1800 979 777',
  true,
  true,
  true,
  now()
);

-- Schedules for: Foodbank WA Perth Branch
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Perth Branch' LIMIT 1), 'monday', 'pantry', '09:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Perth Branch' LIMIT 1), 'tuesday', 'pantry', '09:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Perth Branch' LIMIT 1), 'wednesday', 'pantry', '09:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Perth Branch' LIMIT 1), 'thursday', 'pantry', '09:00', '15:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Perth Branch' LIMIT 1), 'friday', 'pantry', '09:00', '15:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Foodbank Mobile - Armadale Arena',
  'Foodbank WA',
  'Mobile Foodbank offering grocery staples like sauce bases, pasta, rice and canned meals at very low cost. Meat hampers and fresh produce also available.',
  '4 Townley Street (Arena Car Park)',
  'Armadale',
  '6112',
  -32.15,
  116.01,
  '08 9258 9277',
  'https://www.foodbank.org.au/wa',
  'Referral required - call 1800 979 777',
  true,
  true,
  true,
  now()
);

-- Schedules for: Foodbank Mobile - Armadale Arena
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Foodbank Mobile - Armadale Arena' LIMIT 1), 'tuesday', 'pantry', '09:00', '10:15', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Salvation Army Mandurah - Greenfields',
  'Salvation Army',
  'Food parcels available with Centrelink card. Short-term financial assistance including food vouchers. Call Wednesday 8:30am for appointment.',
  'Lakes Road',
  'Greenfields',
  '6210',
  -32.53,
  115.76,
  '08 9535 4951',
  'https://www.salvationarmy.org.au',
  'Requires current Centrelink card with address. Appointment needed.',
  false,
  true,
  true,
  now()
);

-- Schedules for: Salvation Army Mandurah - Greenfields
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Salvation Army Mandurah - Greenfields' LIMIT 1), 'monday', 'food_parcel', '09:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Mandurah - Greenfields' LIMIT 1), 'tuesday', 'food_parcel', '09:00', '12:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Salvation Army Mandurah - Greenfields' LIMIT 1), 'friday', 'food_parcel', '09:00', '12:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Anglicare WA Emergency Relief',
  'Anglicare WA',
  'Emergency food parcels with items for breakfast, lunch, dinner and snacks. Food parcels packed to suit dietary requirements. Centralised phone service available.',
  '55 King Edward Road',
  'Osborne Park',
  '6017',
  -31.905,
  115.815,
  '1800 979 777',
  'https://www.anglicarewa.org.au',
  'Anyone in need of emergency food assistance',
  false,
  true,
  true,
  now()
);

-- Schedules for: Anglicare WA Emergency Relief
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Anglicare WA Emergency Relief' LIMIT 1), 'monday', 'food_parcel', '09:30', '17:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Anglicare WA Emergency Relief' LIMIT 1), 'tuesday', 'food_parcel', '09:30', '17:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Anglicare WA Emergency Relief' LIMIT 1), 'wednesday', 'food_parcel', '09:30', '17:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Anglicare WA Emergency Relief' LIMIT 1), 'thursday', 'food_parcel', '09:30', '17:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Anglicare WA Emergency Relief' LIMIT 1), 'friday', 'food_parcel', '09:30', '17:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'St Vincent de Paul North Perth Conference',
  'St Vincent de Paul Society WA',
  'Emergency relief program providing food, material aid, utility bill assistance, shelter, advocacy and friendship. Home visitations and support services available.',
  '215 Bulwer Street',
  'North Perth',
  '6006',
  -31.935,
  115.855,
  '08 9328 6775',
  'https://www.vinnies.org.au/wa',
  'Anyone in need - emergency relief assistance',
  false,
  true,
  true,
  now()
);

-- Schedules for: St Vincent de Paul North Perth Conference
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'St Vincent de Paul North Perth Conference' LIMIT 1), 'monday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Vincent de Paul North Perth Conference' LIMIT 1), 'tuesday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Vincent de Paul North Perth Conference' LIMIT 1), 'wednesday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Vincent de Paul North Perth Conference' LIMIT 1), 'thursday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'St Vincent de Paul North Perth Conference' LIMIT 1), 'friday', 'food_parcel', '09:00', '16:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Mission Australia Emergency Relief - Wattle House',
  'Mission Australia',
  'Emergency relief including food assistance. Appointments held Tuesday and Thursday 9am-11:30am. Call Monday at 9am to book for current week. First 15 callers served.',
  'Orr Street',
  'Gosnells',
  '6110',
  -32.077,
  116.002,
  '08 9398 0900',
  'https://www.missionaustralia.com.au',
  'Residents of City of Gosnells, Canning, Armadale, Belmont, South Perth and Town of Victoria Park. Appointments required.',
  false,
  true,
  true,
  now()
);

-- Schedules for: Mission Australia Emergency Relief - Wattle House
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Mission Australia Emergency Relief - Wattle House' LIMIT 1), 'tuesday', 'food_parcel', '09:00', '11:30', NULL),
  ((SELECT id FROM locations WHERE name = 'Mission Australia Emergency Relief - Wattle House' LIMIT 1), 'thursday', 'food_parcel', '09:00', '11:30', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'OzHarvest Perth (Rescue Operations)',
  'OzHarvest',
  'Food rescue organization that delivers surplus food to charitable agencies across Perth. Not direct service to public but supports many agencies that do provide meals.',
  '114 Brown Street',
  'East Perth',
  '6004',
  -31.956,
  115.872,
  '08 6500 6450',
  'https://www.ozharvest.org/perth',
  'Food delivered to partner charities - contact for list',
  true,
  true,
  true,
  now()
);

-- Schedules for: OzHarvest Perth (Rescue Operations)
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'OzHarvest Perth (Rescue Operations)' LIMIT 1), 'monday', 'pantry', '08:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'OzHarvest Perth (Rescue Operations)' LIMIT 1), 'tuesday', 'pantry', '08:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'OzHarvest Perth (Rescue Operations)' LIMIT 1), 'wednesday', 'pantry', '08:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'OzHarvest Perth (Rescue Operations)' LIMIT 1), 'thursday', 'pantry', '08:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = 'OzHarvest Perth (Rescue Operations)' LIMIT 1), 'friday', 'pantry', '08:00', '16:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'No Limits Perth Community Hub - Joondalup',
  'No Limits Perth',
  'Monthly community hub providing food hampers and basic essentials. Weekly meals and nourishment programs. School breakfast and lunch programs.',
  'The Hepburn Centre, Whitford Avenue',
  'Marangaroo',
  '6064',
  -31.829,
  115.837,
  '0490 676 979',
  'https://www.nolimitsperth.org.au',
  'Anyone in need',
  false,
  true,
  true,
  now()
);

-- Schedules for: No Limits Perth Community Hub - Joondalup
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'No Limits Perth Community Hub - Joondalup' LIMIT 1), 'wednesday', 'food_parcel', '10:30', '12:30', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  'Foodbank WA Peel Branch',
  'Foodbank WA',
  'Food assistance branch providing hampers with pantry staples, meat, and fresh produce at low cost. Requires phone referral from Emergency Relief and Food Access Service.',
  'Unit 1/68 Reserve Drive',
  'Mandurah',
  '6210',
  -32.529,
  115.749,
  '08 9258 9277',
  'https://www.foodbank.org.au/wa',
  'Referral required - call 1800 979 777',
  true,
  true,
  true,
  now()
);

-- Schedules for: Foodbank WA Peel Branch
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Peel Branch' LIMIT 1), 'monday', 'pantry', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Peel Branch' LIMIT 1), 'tuesday', 'pantry', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Peel Branch' LIMIT 1), 'wednesday', 'pantry', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Peel Branch' LIMIT 1), 'thursday', 'pantry', '08:30', '14:00', NULL),
  ((SELECT id FROM locations WHERE name = 'Foodbank WA Peel Branch' LIMIT 1), 'friday', 'pantry', '08:30', '14:00', NULL);

INSERT INTO locations (name, organisation, description, street_address, suburb, postcode, latitude, longitude, phone, website, eligibility_criteria, referral_required, wheelchair_accessible, is_active, last_verified_at)
VALUES (
  '55 Central',
  '55 Central',
  'Housing and support services for people facing homelessness, mental illness or addiction. Provides food assistance as part of comprehensive support programs.',
  '55 Central Avenue',
  'Maylands',
  '6051',
  -31.934,
  115.898,
  '08 9272 1333',
  'https://55central.asn.au',
  'People facing homelessness, mental illness or addiction',
  false,
  true,
  true,
  now()
);

-- Schedules for: 55 Central
INSERT INTO operating_schedules (location_id, day, meal_type, start_time, end_time, notes) VALUES
  ((SELECT id FROM locations WHERE name = '55 Central' LIMIT 1), 'monday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = '55 Central' LIMIT 1), 'tuesday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = '55 Central' LIMIT 1), 'wednesday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = '55 Central' LIMIT 1), 'thursday', 'food_parcel', '09:00', '16:00', NULL),
  ((SELECT id FROM locations WHERE name = '55 Central' LIMIT 1), 'friday', 'food_parcel', '09:00', '16:00', NULL);

