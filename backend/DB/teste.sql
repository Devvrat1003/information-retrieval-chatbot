DO $$
BEGIN
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_catalog = 'hotelAccounting'
    LOOP
        RAISE NOTICE 'Table: %', r.table_name;
        EXECUTE format(
            'SELECT column_name, data_type, is_nullable, column_default 
             FROM information_schema.columns 
             WHERE table_name = %L AND table_catalog = ''hotelAccounting''', 
            r.table_name
        );
    END LOOP;
END $$;

