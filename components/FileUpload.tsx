'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, jurisdiction: string) => void;
  isAnalyzing: boolean;
}

export default function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps) {
  const [error, setError] = useState<string>('');
  const [continent, setContinent] = useState<string>('North America');
  const [country, setCountry] = useState<string>('US');
  const [stateProvince, setStateProvince] = useState<string>('');

  // Countries by continent (7 continents - geographically accurate)
  const countriesByContinent: Record<string, Array<{ code: string; name: string }>> = {
    'North America': [
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'MX', name: 'Mexico' },
      { code: 'CR', name: 'Costa Rica' },
      { code: 'PA', name: 'Panama' },
      { code: 'TT', name: 'Trinidad and Tobago' },
      { code: 'JM', name: 'Jamaica' },
      { code: 'BB', name: 'Barbados' },
    ],
    'South America': [
      { code: 'BR', name: 'Brazil' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
      { code: 'PE', name: 'Peru' },
      { code: 'VE', name: 'Venezuela' },
      { code: 'EC', name: 'Ecuador' },
      { code: 'UY', name: 'Uruguay' },
    ],
    'Europe': [
      { code: 'UK', name: 'United Kingdom' },
      { code: 'EU', name: 'European Union (General)' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'ES', name: 'Spain' },
      { code: 'IT', name: 'Italy' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'IE', name: 'Ireland' },
      { code: 'CH', name: 'Switzerland' },
      { code: 'BE', name: 'Belgium' },
      { code: 'AT', name: 'Austria' },
      { code: 'SE', name: 'Sweden' },
      { code: 'NO', name: 'Norway' },
      { code: 'DK', name: 'Denmark' },
      { code: 'FI', name: 'Finland' },
      { code: 'PT', name: 'Portugal' },
      { code: 'GR', name: 'Greece' },
      { code: 'PL', name: 'Poland' },
      { code: 'CZ', name: 'Czech Republic' },
      { code: 'RO', name: 'Romania' },
      { code: 'HU', name: 'Hungary' },
      { code: 'RU', name: 'Russia' },
      { code: 'UA', name: 'Ukraine' },
    ],
    'Asia': [
      { code: 'IN', name: 'India' },
      { code: 'CN', name: 'China' },
      { code: 'JP', name: 'Japan' },
      { code: 'KR', name: 'South Korea' },
      { code: 'SG', name: 'Singapore' },
      { code: 'HK', name: 'Hong Kong' },
      { code: 'TW', name: 'Taiwan' },
      { code: 'MY', name: 'Malaysia' },
      { code: 'TH', name: 'Thailand' },
      { code: 'ID', name: 'Indonesia' },
      { code: 'PH', name: 'Philippines' },
      { code: 'VN', name: 'Vietnam' },
      { code: 'PK', name: 'Pakistan' },
      { code: 'BD', name: 'Bangladesh' },
      { code: 'LK', name: 'Sri Lanka' },
      { code: 'AE', name: 'United Arab Emirates' },
      { code: 'SA', name: 'Saudi Arabia' },
      { code: 'IL', name: 'Israel' },
      { code: 'TR', name: 'Turkey' },
      { code: 'QA', name: 'Qatar' },
      { code: 'KW', name: 'Kuwait' },
      { code: 'BH', name: 'Bahrain' },
      { code: 'OM', name: 'Oman' },
      { code: 'JO', name: 'Jordan' },
      { code: 'LB', name: 'Lebanon' },
    ],
    'Africa': [
      { code: 'ZA', name: 'South Africa' },
      { code: 'NG', name: 'Nigeria' },
      { code: 'EG', name: 'Egypt' },
      { code: 'KE', name: 'Kenya' },
      { code: 'MA', name: 'Morocco' },
      { code: 'GH', name: 'Ghana' },
      { code: 'ET', name: 'Ethiopia' },
      { code: 'TZ', name: 'Tanzania' },
      { code: 'UG', name: 'Uganda' },
    ],
    'Australia': [
      { code: 'AU', name: 'Australia' },
      { code: 'NZ', name: 'New Zealand' },
    ],
    'Antarctica': [
      // No countries - governed by Antarctic Treaty System
    ],
  };

  // States/Provinces mapping for countries with subdivisions
  const statesProvinces: Record<string, string[]> = {
    'US': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'],
    'CA': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'],
    'AU': ['New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia', 'Australian Capital Territory', 'Northern Territory'],
    'IN': ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'],
    'BR': ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'],
    'MX': ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Mexico City', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'],
    'DE': ['Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'],
    'CH': ['Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 'Lucerne', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 'Solothurn', 'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'],
    'AE': ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
  };

  const jurisdiction = stateProvince ? `${country}-${stateProvince}` : country;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('');

      if (acceptedFiles.length === 0) {
        setError('Please upload a valid PDF, DOCX, or TXT file');
        return;
      }

      const file = acceptedFiles[0];
      const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');

      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }

      onFileSelect(file, jurisdiction);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  return (
    <div className="w-full">
      {/* Jurisdiction Selector - Three Tier Selection */}
      <div className="mb-6 bg-white border-2 border-stone-300 p-6">
        <div className="mb-4">
          <span className="mono text-xs text-stone-500 tracking-wider uppercase font-medium mb-2 block">Legal Jurisdiction</span>
          <p className="text-sm text-stone-600 mb-4 leading-relaxed">Select the location where this contract will be enforced. Laws vary significantly by region.</p>
        </div>

        <div className="space-y-4">
          {/* Step 1: Continent Selection */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-sm font-semibold text-stone-900">Continent</span>
            </div>
            <select
              value={continent}
              onChange={(e) => {
                setContinent(e.target.value);
                // Set first country as default when continent changes
                const firstCountry = countriesByContinent[e.target.value]?.[0];
                if (firstCountry) {
                  setCountry(firstCountry.code);
                  setStateProvince('');
                }
              }}
              disabled={isAnalyzing}
              className="w-full px-4 py-3 border-2 border-stone-300 text-stone-900 font-medium focus:border-stone-900 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Africa">Africa</option>
              <option value="Australia">Australia & Oceania</option>
              <option value="Antarctica">Antarctica</option>
            </select>
          </label>

          {/* Step 2: Country Selection */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-sm font-semibold text-stone-900">Country</span>
            </div>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setStateProvince(''); // Reset state/province when country changes
              }}
              disabled={isAnalyzing}
              className="w-full px-4 py-3 border-2 border-stone-300 text-stone-900 font-medium focus:border-stone-900 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countriesByContinent[continent]?.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Step 3: State/Province Selection or General Law */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-sm font-semibold text-stone-900">
                {statesProvinces[country]
                  ? (country === 'US' ? 'State' : country === 'CA' ? 'Province/Territory' : country === 'AU' ? 'State/Territory' : country === 'AE' ? 'Emirate' : 'State/Province')
                  : 'Legal Framework'
                }
              </span>
            </div>
            {statesProvinces[country] ? (
              <select
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                disabled={isAnalyzing}
                className="w-full px-4 py-3 border-2 border-stone-300 text-stone-900 font-medium focus:border-stone-900 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {country === 'US' || country === 'CA' ? 'Federal Law (General)' : country === 'EU' ? 'European Union Law' : 'Central/National Law (General)'}
                </option>
                {statesProvinces[country].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-4 py-3 border-2 border-stone-300 bg-stone-50 text-stone-700 font-medium">
                {country === 'EU' ? 'European Union Law' : 'National Law (General)'}
              </div>
            )}
          </label>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`
          relative border-2 bg-white p-20 text-center cursor-pointer overflow-hidden
          transition-all duration-300 ease-in-out group
          ${isDragActive ? 'border-stone-900 bg-stone-50 scale-[1.02]' : 'border-stone-300 hover:border-stone-900 hover:shadow-sm'}
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="flex flex-col items-center gap-6">
          {acceptedFiles.length > 0 && !isAnalyzing ? (
            <>
              <div className="relative">
                <FileText className="w-20 h-20 text-stone-900" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900 mb-2">
                  {acceptedFiles[0].name}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="mono text-sm text-stone-500">
                    {(acceptedFiles[0].size / 1024).toFixed(2)} KB
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Ready for Analysis</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <Upload className={`w-20 h-20 transition-all duration-300 ${isDragActive ? 'text-stone-900 scale-110' : 'text-stone-400 group-hover:text-stone-700'
                  }`} />
                <div className="absolute inset-0 border-2 border-dashed border-stone-300 rounded-full group-hover:border-stone-900 transition-colors duration-300 scale-150"></div>
              </div>
              <div>
                <p className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-stone-700 transition-colors">
                  {isDragActive ? 'Release to Upload' : 'Submit Contract for Analysis'}
                </p>
                <p className="text-stone-600 mb-4 font-light text-lg">
                  Drag and drop document or click to select
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="mono text-xs text-stone-500 uppercase tracking-wider font-medium">PDF</span>
                  <span className="text-stone-300">•</span>
                  <span className="mono text-xs text-stone-500 uppercase tracking-wider font-medium">DOCX</span>
                  <span className="text-stone-300">•</span>
                  <span className="mono text-xs text-stone-500 uppercase tracking-wider font-medium">TXT</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-medium">Max 10MB</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-5 bg-white border-2 border-stone-900 flex items-start gap-4 animate-slide-in">
          <AlertCircle className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Upload Error</p>
            <p className="text-sm text-stone-800 font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
