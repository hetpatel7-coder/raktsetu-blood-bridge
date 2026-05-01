
-- Donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  donations_count INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blood Requests table
CREATE TABLE public.blood_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT,
  blood_type TEXT NOT NULL,
  hospital TEXT NOT NULL,
  city TEXT,
  urgency TEXT NOT NULL DEFAULT 'normal',
  contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SOS Alerts table
CREATE TABLE public.sos_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blood_type TEXT NOT NULL,
  hospital TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- Public read & insert policies (this is a public emergency network)
CREATE POLICY "Anyone can view donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert donors" ON public.donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update donors" ON public.donors FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete donors" ON public.donors FOR DELETE USING (true);

CREATE POLICY "Anyone can view requests" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert requests" ON public.blood_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update requests" ON public.blood_requests FOR UPDATE USING (true);

CREATE POLICY "Anyone can view sos" ON public.sos_alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sos" ON public.sos_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sos" ON public.sos_alerts FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donors;

-- Seed sample donors across Gujarat cities
INSERT INTO public.donors (name, blood_type, phone, city, available, donations_count, verified, lat, lng) VALUES
('Rahul Patel', 'O+', '+919876543210', 'Ahmedabad', true, 12, true, 23.0225, 72.5714),
('Priya Shah', 'A+', '+919876543211', 'Ahmedabad', true, 8, true, 23.0325, 72.5814),
('Amit Mehta', 'B+', '+919876543212', 'Surat', true, 5, false, 21.1702, 72.8311),
('Neha Desai', 'AB+', '+919876543213', 'Vadodara', true, 15, true, 22.3072, 73.1812),
('Vikram Singh', 'O-', '+919876543214', 'Rajkot', true, 20, true, 22.3039, 70.8022),
('Anita Joshi', 'A-', '+919876543215', 'Gandhinagar', false, 3, false, 23.2156, 72.6369),
('Karan Patel', 'B-', '+919876543216', 'Ahmedabad', true, 7, true, 23.0125, 72.5614),
('Meera Trivedi', 'AB-', '+919876543217', 'Surat', true, 2, false, 21.1802, 72.8411),
('Suresh Kumar', 'O+', '+919876543218', 'Ahmedabad', true, 18, true, 23.0425, 72.5914),
('Pooja Rao', 'A+', '+919876543219', 'Vadodara', true, 6, true, 22.3172, 73.1912),
('Rohit Sharma', 'B+', '+919876543220', 'Rajkot', false, 4, false, 22.3139, 70.8122),
('Kavita Iyer', 'O-', '+919876543221', 'Gandhinagar', true, 11, true, 23.2256, 72.6469),
('Arjun Reddy', 'AB+', '+919876543222', 'Ahmedabad', true, 9, true, 23.0525, 72.6014);

INSERT INTO public.blood_requests (patient_name, blood_type, hospital, city, urgency, contact_phone, status) VALUES
('Patient A', 'O+', 'Apollo Hospital', 'Ahmedabad', 'critical', '+919900000001', 'active'),
('Patient B', 'AB-', 'Sterling Hospital', 'Ahmedabad', 'urgent', '+919900000002', 'active'),
('Patient C', 'B+', 'Civil Hospital', 'Surat', 'normal', '+919900000003', 'active'),
('Patient D', 'A+', 'SSG Hospital', 'Vadodara', 'fulfilled', '+919900000004', 'fulfilled');
