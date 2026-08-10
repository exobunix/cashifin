"use client";
import React, { useState, useEffect } from 'react';

const availableCategories = ['Smartphones', 'Laptops', 'Tablets', 'Smart Watches'];
const availableBrands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Dell', 'Lenovo', 'Xiaomi', 'Realme', 'Oppo', 'Vivo'];
const availableModels = ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14 Pro', 'Galaxy S23', 'OnePlus 11', 'MacBook Air M2', 'Dell XPS 13'];

export default function RulesEnginePage() {
  const [rules, setRules] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);

  // Form states - Pricing Rule Builder
  const [targetQuestion, setTargetQuestion] = useState('');
  const [triggerAnswer, setTriggerAnswer] = useState('');
  const [deductionPercent, setDeductionPercent] = useState('');
  
  const [mappedCats, setMappedCats] = useState<string[]>(['Smartphones']);
  const [mappedBrands, setMappedBrands] = useState<string[]>(['Apple']);
  const [mappedModels, setMappedModels] = useState<string[]>(['iPhone 12']);
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    fetchRules();
    fetchQuestions();
  }, []);

  const fetchRules = () => {
    fetch('/api/pricingRules')
      .then(res => res.json())
      .then(data => setRules(data || []));
  };

  const fetchQuestions = () => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data || []);
        if (data && data.length > 0) {
          setTargetQuestion(data[0].text);
        }
      });
  };

  const handleToggleMapping = (val: string, list: string[], setter: any) => {
    if (list.includes(val)) {
      setter(list.filter(item => item !== val));
    } else {
      setter([...list, val]);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuestion || !triggerAnswer || !deductionPercent) return;

    const conditionText = `IF "${targetQuestion}" is "${triggerAnswer}"`;
    const newRule = {
      id: `RULE-0${rules.length + 1}`,
      condition: conditionText,
      deduction: `Reduce ${deductionPercent}%`,
      category: mappedCats.join(', '),
      brands: mappedBrands,
      models: mappedModels,
      status
    };

    const res = await fetch('/api/pricingRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newRule })
    });
    const result = await res.json();
    if (result.success) {
      setRules(result.data);
    }
    
    setTriggerAnswer('');
    setDeductionPercent('');
    setShowAddModal(false);
  };

  const handleEditClick = (rule: any) => {
    setSelectedRule(rule);
    
    // Parse condition text if possible (e.g. IF "Screen Condition" is "Cracked")
    const match = rule.condition.match(/IF "(.*)" is "(.*)"/);
    if (match) {
      setTargetQuestion(match[1]);
      setTriggerAnswer(match[2]);
    } else {
      setTargetQuestion(questions[0]?.text || '');
      setTriggerAnswer(rule.condition);
    }

    const pctMatch = rule.deduction.match(/Reduce (\d+)%/);
    setDeductionPercent(pctMatch ? pctMatch[1] : '15');
    
    setMappedCats(rule.category ? rule.category.split(', ') : ['Smartphones']);
    setMappedBrands(rule.brands || ['Apple']);
    setMappedModels(rule.models || ['iPhone 12']);
    setStatus(rule.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuestion || !triggerAnswer || !deductionPercent || !selectedRule) return;

    const conditionText = `IF "${targetQuestion}" is "${triggerAnswer}"`;
    const updatedRule = {
      ...selectedRule,
      condition: conditionText,
      deduction: `Reduce ${deductionPercent}%`,
      category: mappedCats.join(', '),
      brands: mappedBrands,
      models: mappedModels,
      status
    };

    const res = await fetch('/api/pricingRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedRule })
    });
    const result = await res.json();
    if (result.success) {
      setRules(result.data);
    }
    setShowEditModal(false);
    setSelectedRule(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;
    const res = await fetch('/api/pricingRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setRules(result.data);
    }
  };

  const filtered = rules.filter((r: any) => r.condition.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4 text-slate-800">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Dynamic Pricing Rules Engine</h3>
          <p className="text-xs text-slate-400">Build conditional value reductions mapped to diagnostic options</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search rules..."
            className="p-2 border rounded text-xs w-64 bg-white focus:outline-none"
          />
          <button 
            onClick={() => {
              setTriggerAnswer('');
              setDeductionPercent('');
              setMappedCats(['Smartphones']);
              setMappedBrands(['Apple']);
              setMappedModels(['iPhone 12']);
              setStatus('Active');
              setShowAddModal(true);
            }} 
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition shadow-xs"
          >
            Create Rule
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Rule ID</th>
              <th className="p-3">Condition (IF question & answer combo)</th>
              <th className="p-3">Deduction (%)</th>
              <th className="p-3">Category Mapping</th>
              <th className="p-3">Brands / Models Mapped</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r: any) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{r.id}</td>
                <td className="p-3 font-bold text-slate-800">{r.condition}</td>
                <td className="p-3 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block my-1.5">{r.deduction}</td>
                <td className="p-3 text-slate-500">{r.category}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate">
                  {r.brands?.join(', ') || 'All Brands'} / {r.models?.join(', ') || 'All Models'}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleEditClick(r)} className="text-emerald-600 hover:text-emerald-800 font-bold">✏️ Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="text-rose-500 hover:text-rose-700 font-bold">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl space-y-4 my-8 text-xs text-slate-800">
            <h4 className="font-bold text-sm border-b pb-2">Create Pricing Rule Builder</h4>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              
              {/* Question Dropdown selection */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Select Diagnostic Question</label>
                <select value={targetQuestion} onChange={e => setTargetQuestion(e.target.value)} className="p-2 border rounded bg-slate-50">
                  {questions.map((q: any) => <option key={q.id} value={q.text}>{q.text}</option>)}
                </select>
              </div>

              {/* Trigger Answer value */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Trigger Answer Option Value</label>
                <input 
                  type="text" 
                  value={triggerAnswer} 
                  onChange={e => setTriggerAnswer(e.target.value)} 
                  placeholder="e.g. Cracked, Duplicate Display, Dead" 
                  className="p-2 border rounded" 
                  required 
                />
              </div>

              {/* Deduction Percentage */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Deduction Value in Percent (%)</label>
                <input 
                  type="number" 
                  value={deductionPercent} 
                  onChange={e => setDeductionPercent(e.target.value)} 
                  placeholder="e.g. 15" 
                  className="p-2 border rounded" 
                  required 
                />
              </div>

              {/* Multi-select check list Categories */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Category Mappings (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 border rounded max-h-20 overflow-y-auto">
                  {availableCategories.map(c => (
                    <label key={c} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedCats.includes(c)} onChange={() => handleToggleMapping(c, mappedCats, setMappedCats)} className="rounded text-emerald-500" />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi-select check list Brands */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Brand Mappings (Multi-select)</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 border rounded max-h-20 overflow-y-auto">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedBrands.includes(b)} onChange={() => handleToggleMapping(b, mappedBrands, setMappedBrands)} className="rounded text-emerald-500" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi-select check list Models */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Model Mappings (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 border rounded max-h-20 overflow-y-auto">
                  {availableModels.map(m => (
                    <label key={m} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedModels.includes(m)} onChange={() => handleToggleMapping(m, mappedModels, setMappedModels)} className="rounded text-emerald-500" />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Rule Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl space-y-4 my-8 text-xs text-slate-800">
            <h4 className="font-bold text-sm border-b pb-2">Edit Pricing Rule Builder - {selectedRule?.id}</h4>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Select Diagnostic Question</label>
                <select value={targetQuestion} onChange={e => setTargetQuestion(e.target.value)} className="p-2 border rounded bg-slate-50">
                  {questions.map((q: any) => <option key={q.id} value={q.text}>{q.text}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Trigger Answer Option Value</label>
                <input type="text" value={triggerAnswer} onChange={e => setTriggerAnswer(e.target.value)} className="p-2 border rounded" required />
              </div>
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Deduction Value in Percent (%)</label>
                <input type="number" value={deductionPercent} onChange={e => setDeductionPercent(e.target.value)} className="p-2 border rounded" required />
              </div>

              {/* Multi-select check list Categories */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Category Mappings (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 border rounded max-h-20 overflow-y-auto">
                  {availableCategories.map(c => (
                    <label key={c} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedCats.includes(c)} onChange={() => handleToggleMapping(c, mappedCats, setMappedCats)} className="rounded text-emerald-500" />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi-select check list Brands */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Brand Mappings (Multi-select)</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 border rounded max-h-20 overflow-y-auto">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedBrands.includes(b)} onChange={() => handleToggleMapping(b, mappedBrands, setMappedBrands)} className="rounded text-emerald-500" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi-select check list Models */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Model Mappings (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 border rounded max-h-20 overflow-y-auto">
                  {availableModels.map(m => (
                    <label key={m} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedModels.includes(m)} onChange={() => handleToggleMapping(m, mappedModels, setMappedModels)} className="rounded text-emerald-500" />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1.5 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Update Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
