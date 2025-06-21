'use client';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: query }),
    });
    const data = await res.json();
    setResponse(data.response);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>LangChain Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '80%', padding: '10px' }}
          placeholder="Ask something..."
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
      </form>
      <div style={{ marginTop: 20 }}>
        <strong>Response:</strong>
        <pre>{response}</pre>
      </div>
    </main>
  );
}
'use client';
import React, { useState, useEffect } from 'react';
import { Calculator, Leaf, BarChart3, Settings, Download, RotateCcw } from 'lucide-react';

const DungProModern = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [formData, setFormData] = useState({
    location: '',
    precipitation: '',
    pH: '',
    soilType: '',
    potassiumFixation: '',
    soilAnalysis: {
      pH: '',
      P2O5: '',
      K2O: '',
      Mg: '',
      Na: '',
      Cu: '',
      B: '',
      Mn: '',
      Zn: '',
      Humus: ''
    },
    crops: [
      { type: '', yield: '', strawRemoved: false },
      { type: '', yield: '', strawRemoved: false },
      { type: '', yield: '', strawRemoved: false }
    ],
    organicFertilizers: [
      { type: '', amount: '' },
      { type: '', amount: '' }
    ]
  });

  const soilTypes = [
    'S (flachgr.)', 'S', 'lS - sU', 'ssL- lU', 'sL - uL - L', 'utL - tL - T'
  ];

  const cropTypes = [
    'Gerste', 'Roggen', 'Triticale', 'Weizen', 'Hafer', 'So-Gerste', 'Dinkel',
    'Körnermais', 'CCM', 'Ackerbohnen', 'Futtererbsen', 'Lupine (Weiße)',
    'Raps (Körner-)', 'Sonnenblumen', 'Öllein', 'Zuckerrüben', 'Kartoffeln',
    'Silomais', 'Weidelgras', 'Rotklee', 'Luzerne', 'Kleegras'
  ];

  // Function to calculate supply level based on soil analysis values
  const calculateSupplyLevel = (nutrient, value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return '';
    
    // Simplified classification - in real app, this would be more complex
    const classifications = {
      P2O5: { A: [0, 3], B: [3, 6], C: [6, 15], D: [15, 25], E: [25, 100] },
      K2O: { A: [0, 4], B: [4, 8], C: [8, 15], D: [15, 25], E: [25, 100] },
      Mg: { A: [0, 3], B: [3, 5], C: [5, 10], D: [10, 15], E: [15, 100] }
    };
    
    const ranges = classifications[nutrient];
    if (!ranges) return '';
    
    for (const [level, [min, max]] of Object.entries(ranges)) {
      if (val >= min && val < max) return level;
    }
    return 'E'; // Very high if above all ranges
  };

  const fertilizerTypes = [
    'Rindermist', 'Schweinemist', 'Pferdemist', 'Hühnerfrischkot',
    'Milchviehgülle', 'Rindermastgülle', 'Schweinegülle', 'Kompost (Grün-; Bio-)'
  ];

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, index] = key.split('[');
          const idx = parseInt(index.replace(']', ''));
          current = current[arrayKey][idx];
        } else {
          current = current[key];
        }
      }
      
      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;
      
      return newData;
    });
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
        activeTab === id
          ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
          : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const InputSection = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        {title}
      </h3>
      {children}
    </div>
  );

  const FormField = ({ label, children, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  const Select = ({ value, onChange, options, placeholder = "Bitte wählen" }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>{option}</option>
      ))}
    </select>
  );

  const Input = ({ value, onChange, type = "text", placeholder = "" }) => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
    />
  );

  const renderInputTab = () => (
    <div className="space-y-6">
      {/* Site Conditions */}
      <InputSection title="Standortbedingungen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Standort">
            <Input
              value={formData.location}
              onChange={(value) => updateFormData('location', value)}
              placeholder="Standort eingeben"
            />
          </FormField>
          <FormField label="Jahres-Niederschlag (mm)">
            <Input
              type="number"
              value={formData.precipitation}
              onChange={(value) => updateFormData('precipitation', value)}
              placeholder="z.B. 650"
            />
          </FormField>
          <FormField label="pH-Wert">
            <Input
              type="number"
              step="0.1"
              value={formData.pH}
              onChange={(value) => updateFormData('pH', value)}
              placeholder="z.B. 6.5"
            />
          </FormField>
          <FormField label="Bodenart">
            <Select
              value={formData.soilType}
              onChange={(value) => updateFormData('soilType', value)}
              options={soilTypes}
            />
          </FormField>
          <FormField label="Kalifixierung">
            <Select
              value={formData.potassiumFixation}
              onChange={(value) => updateFormData('potassiumFixation', value)}
              options={['nein', 'ja']}
            />
          </FormField>
        </div>
      </InputSection>

      {/* Soil Analysis Section */}
      <InputSection title="Bodenversorgung">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <FormField label="pH">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.pH}
              onChange={(value) => updateFormData('soilAnalysis.pH', value)}
              placeholder="z.B. 6.5"
            />
          </FormField>
          <FormField label="P₂O₅ (mg/100g)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.P2O5}
              onChange={(value) => updateFormData('soilAnalysis.P2O5', value)}
              placeholder="z.B. 15"
            />
          </FormField>
          <FormField label="K₂O (mg/100g)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.K2O}
              onChange={(value) => updateFormData('soilAnalysis.K2O', value)}
              placeholder="z.B. 12"
            />
          </FormField>
          <FormField label="Mg (mg/100g)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.Mg}
              onChange={(value) => updateFormData('soilAnalysis.Mg', value)}
              placeholder="z.B. 8"
            />
          </FormField>
          <FormField label="Humus (%)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.Humus}
              onChange={(value) => updateFormData('soilAnalysis.Humus', value)}
              placeholder="z.B. 2.5"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <FormField label="Na (mg/kg)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.Na}
              onChange={(value) => updateFormData('soilAnalysis.Na', value)}
              placeholder="z.B. 25"
            />
          </FormField>
          <FormField label="Cu (mg/kg)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.Cu}
              onChange={(value) => updateFormData('soilAnalysis.Cu', value)}
              placeholder="z.B. 2.5"
            />
          </FormField>
          <FormField label="B (mg/kg)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.B}
              onChange={(value) => updateFormData('soilAnalysis.B', value)}
              placeholder="z.B. 0.8"
            />
          </FormField>
          <FormField label="Mn (mg/kg)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.Mn}
              onChange={(value) => updateFormData('soilAnalysis.Mn', value)}
              placeholder="z.B. 150"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <FormField label="Zn (mg/kg)">
            <Input
              type="number"
              step="0.1"
              value={formData.soilAnalysis.Zn}
              onChange={(value) => updateFormData('soilAnalysis.Zn', value)}
              placeholder="z.B. 3.5"
            />
          </FormField>
        </div>
      </InputSection>

      {/* Supply Level Display */}
      <InputSection title="Versorgungsstufe">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

             <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">pH </div>
            <div className={`text-lg font-semibold ${
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'A' ? 'text-red-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'B' ? 'text-orange-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'C' ? 'text-green-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'D' ? 'text-blue-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'E' ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) || '--'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">P₂O₅ </div>
            <div className={`text-lg font-semibold ${
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'A' ? 'text-red-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'B' ? 'text-orange-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'C' ? 'text-green-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'D' ? 'text-blue-600' :
              calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) === 'E' ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {calculateSupplyLevel('P2O5', formData.soilAnalysis.P2O5) || '--'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">K₂O </div>
            <div className={`text-lg font-semibold ${
              calculateSupplyLevel('K2O', formData.soilAnalysis.K2O) === 'A' ? 'text-red-600' :
              calculateSupplyLevel('K2O', formData.soilAnalysis.K2O) === 'B' ? 'text-orange-600' :
              calculateSupplyLevel('K2O', formData.soilAnalysis.K2O) === 'C' ? 'text-green-600' :
              calculateSupplyLevel('K2O', formData.soilAnalysis.K2O) === 'D' ? 'text-blue-600' :
              calculateSupplyLevel('K2O', formData.soilAnalysis.K2O) === 'E' ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {calculateSupplyLevel('K2O', formData.soilAnalysis.K2O) || '--'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Mg </div>
            <div className={`text-lg font-semibold ${
              calculateSupplyLevel('Mg', formData.soilAnalysis.Mg) === 'A' ? 'text-red-600' :
              calculateSupplyLevel('Mg', formData.soilAnalysis.Mg) === 'B' ? 'text-orange-600' :
              calculateSupplyLevel('Mg', formData.soilAnalysis.Mg) === 'C' ? 'text-green-600' :
              calculateSupplyLevel('Mg', formData.soilAnalysis.Mg) === 'D' ? 'text-blue-600' :
              calculateSupplyLevel('Mg', formData.soilAnalysis.Mg) === 'E' ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {calculateSupplyLevel('Mg', formData.soilAnalysis.Mg) || '--'}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Klassifizierung:</strong> A (sehr niedrig) • B (niedrig) • C (ausreichend) • D (hoch) • E (sehr hoch)
          </div>
        </div>
      </InputSection>

      {/* Crop Rotation */}
      <InputSection title="Fruchtfolge (3 Jahre)">
        <div className="space-y-4">
          {formData.crops.map((crop, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">{index + 1}. Jahr</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Hauptfrucht">
                  <Select
                    value={crop.type}
                    onChange={(value) => updateFormData(`crops[${index}].type`, value)}
                    options={cropTypes}
                  />
                </FormField>
                <FormField label="Ertrag (t/ha)">
                  <Input
                    type="number"
                    step="0.1"
                    value={crop.yield}
                    onChange={(value) => updateFormData(`crops[${index}].yield`, value)}
                    placeholder="z.B. 7.5"
                  />
                </FormField>
                <FormField label="Stroh/Blatt abgefahren">
                  <Select
                    value={crop.strawRemoved ? 'ja' : 'nein'}
                    onChange={(value) => updateFormData(`crops[${index}].strawRemoved`, value === 'ja')}
                    options={['nein', 'ja']}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </InputSection>

      {/* Organic Fertilizers */}
      <InputSection title="Organische Düngung">
        <div className="space-y-4">
          {formData.organicFertilizers.map((fertilizer, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Dungart {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Art der Düngung">
                  <Select
                    value={fertilizer.type}
                    onChange={(value) => updateFormData(`organicFertilizers[${index}].type`, value)}
                    options={fertilizerTypes}
                  />
                </FormField>
                <FormField label="Menge (t/ha oder m³/ha)">
                  <Input
                    type="number"
                    step="0.1"
                    value={fertilizer.amount}
                    onChange={(value) => updateFormData(`organicFertilizers[${index}].amount`, value)}
                    placeholder="z.B. 25"
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </InputSection>
    </div>
  );

  const renderNutrientsTab = () => (
    <div className="space-y-6">
      <InputSection title="Nährstoffgehalte Boden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField label="P₂O₅ (mg/100g)">
            <Input type="number" placeholder="z.B. 15" />
          </FormField>
          <FormField label="K₂O (mg/100g)">
            <Input type="number" placeholder="z.B. 12" />
          </FormField>
          <FormField label="Mg (mg/100g)">
            <Input type="number" placeholder="z.B. 8" />
          </FormField>
          <FormField label="Humus (%)">
            <Input type="number" step="0.1" placeholder="z.B. 2.5" />
          </FormField>
        </div>
      </InputSection>

      <InputSection title="Organische Dünger - Nährstoffgehalte">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Düngerart</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">CaO (kg/t)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">P₂O₅ (kg/t)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">K₂O (kg/t)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MgO (kg/t)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">Rindermist</td>
                <td className="px-4 py-3"><Input type="number" placeholder="3.0" className="w-20" /></td>
                <td className="px-4 py-3"><Input type="number" placeholder="2.8" className="w-20" /></td>
                <td className="px-4 py-3"><Input type="number" placeholder="7.2" className="w-20" /></td>
                <td className="px-4 py-3"><Input type="number" placeholder="1.8" className="w-20" /></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">Milchviehgülle</td>
                <td className="px-4 py-3"><Input type="number" placeholder="2.2" className="w-20" /></td>
                <td className="px-4 py-3"><Input type="number" placeholder="1.8" className="w-20" /></td>
                <td className="px-4 py-3"><Input type="number" placeholder="5.5" className="w-20" /></td>
                <td className="px-4 py-3"><Input type="number" placeholder="1.2" className="w-20" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </InputSection>
    </div>
  );

  const renderResultsTab = () => (
    <div className="space-y-6">
      <InputSection title="Düngungsempfehlung Fruchtfolge" className="bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">145</div>
            <div className="text-sm text-gray-600">P₂O₅ kg/ha</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">280</div>
            <div className="text-sm text-gray-600">K₂O kg/ha</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">85</div>
            <div className="text-sm text-gray-600">MgO kg/ha</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">120</div>
            <div className="text-sm text-gray-600">CaO kg/ha</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-pink-600">15</div>
            <div className="text-sm text-gray-600">Na kg/ha</div>
          </div>
        </div>
      </InputSection>

      <InputSection title="Bilanz Einzeljahre">
        <div className="space-y-4">
          {[1, 2, 3].map((year) => (
            <div key={year} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">{year}. Jahr</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">48</div>
                  <div className="text-sm text-gray-600">P₂O₅ Empfehlung</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">95</div>
                  <div className="text-sm text-gray-600">K₂O Empfehlung</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">28</div>
                  <div className="text-sm text-gray-600">MgO Empfehlung</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">40</div>
                  <div className="text-sm text-gray-600">CaO Empfehlung</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InputSection>

      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Download size={18} />
          PDF Export
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <RotateCcw size={18} />
          Zurücksetzen
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DungPro</h1>
                <p className="text-sm text-gray-600">Moderne Düngungsberatung</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Settings size={16} />
              <span>Version 2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <TabButton id="input" label="Eingabe" icon={Calculator} />
            <TabButton id="nutrients" label="Nährstoffgehalte" icon={Settings} />
            <TabButton id="results" label="Ergebnisse" icon={BarChart3} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'input' && renderInputTab()}
        {activeTab === 'nutrients' && renderNutrientsTab()}
        {activeTab === 'results' && renderResultsTab()}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Leaf size={16} />
              <span className="text-sm">© 2025 DungPro - Nachhaltige Landwirtschaft</span>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-emerald-600">Impressum</a>
              <a href="#" className="text-sm text-gray-600 hover:text-emerald-600">Datenschutz</a>
              <a href="#" className="text-sm text-gray-600 hover:text-emerald-600">Hilfe</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DungProModern;
