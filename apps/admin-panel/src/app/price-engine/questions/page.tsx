"use client";
import React, { useState, useEffect } from 'react';

const availableCategories = ['Smartphones', 'Laptops', 'Tablets', 'Smart Watches'];
const availableBrands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Dell', 'Lenovo', 'Xiaomi', 'Realme', 'Oppo', 'Vivo'];
const availableModels = ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14 Pro', 'Galaxy S23', 'OnePlus 11', 'MacBook Air M2', 'Dell XPS 13'];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');

  // Dropdown filter selections
  const [selCategory, setSelCategory] = useState('Smartphones');
  const [selBrand, setSelBrand] = useState('Apple');
  const [selModel, setSelModel] = useState('iPhone 11');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  // Form states
  const [text, setText] = useState('');
  const [type, setType] = useState('Single Select');
  const [impact, setImpact] = useState('High');
  const [required, setRequired] = useState(true);
  const [mappedCats, setMappedCats] = useState<string[]>(['Smartphones']);
  const [mappedBrands, setMappedBrands] = useState<string[]>(['Apple']);
  const [mappedModels, setMappedModels] = useState<string[]>(['iPhone 11']);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data || []));
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
    if (!text) return;

    const newQ = {
      id: questions.length + 1,
      order: questions.length + 1,
      text,
      type,
      impact,
      required,
      status: 'Active',
      categories: mappedCats,
      brands: mappedBrands,
      models: mappedModels
    };

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', item: newQ })
    });
    const result = await res.json();
    if (result.success) {
      setQuestions(result.data);
    }
    
    setText('');
    setShowAddModal(false);
  };

  const handleEditClick = (q: any) => {
    setSelectedQuestion(q);
    setText(q.text);
    setType(q.type);
    setImpact(q.impact);
    setRequired(q.required);
    setMappedCats(q.categories || []);
    setMappedBrands(q.brands || []);
    setMappedModels(q.models || []);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !selectedQuestion) return;

    const updatedQ = {
      ...selectedQuestion,
      text,
      type,
      impact,
      required,
      categories: mappedCats,
      brands: mappedBrands,
      models: mappedModels
    };

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', item: updatedQ })
    });
    const result = await res.json();
    if (result.success) {
      setQuestions(result.data);
    }
    setShowEditModal(false);
    setSelectedQuestion(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const result = await res.json();
    if (result.success) {
      setQuestions(result.data);
    }
  };

  // Filter logic: Only display questions that map to the selected Category AND Brand AND Model
  const filtered = questions.filter((q: any) => {
    const textMatch = q.text.toLowerCase().includes(search.toLowerCase());
    
    const catMatch = q.categories ? q.categories.includes(selCategory) : true;
    const brandMatch = q.brands ? q.brands.includes(selBrand) : true;
    const modelMatch = q.models ? q.models.includes(selModel) : true;

    return textMatch && catMatch && brandMatch && modelMatch;
  });

  return (
    <div className="p-6 space-y-6 text-slate-800">
      {/* Heading */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Price Engine - Question Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Create, edit, and map inspection questions to specific product categories, brands, and models</p>
        </div>
        <button 
          onClick={() => {
            setText('');
            setType('Single Select');
            setImpact('High');
            setRequired(true);
            setMappedCats([selCategory]);
            setMappedBrands([selBrand]);
            setMappedModels([selModel]);
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
        >
          + Add Question
        </button>
      </div>

      {/* Filter Selectors Box */}
      <div className="bg-white p-4 rounded-xl border shadow-2xs grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Filter by Category</label>
          <select value={selCategory} onChange={e => setSelCategory(e.target.value)} className="p-2 border rounded bg-slate-50 text-xs font-semibold text-slate-700">
            {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Filter by Brand</label>
          <select value={selBrand} onChange={e => setSelBrand(e.target.value)} className="p-2 border rounded bg-slate-50 text-xs font-semibold text-slate-700">
            {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Filter by Model</label>
          <select value={selModel} onChange={e => setSelModel(e.target.value)} className="p-2 border rounded bg-slate-50 text-xs font-semibold text-slate-700">
            {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Search and stats */}
      <div className="flex justify-between items-center">
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search questions..." 
          className="p-2 border rounded text-xs w-64 bg-white focus:outline-none" 
        />
        <span className="text-xs text-slate-400 font-bold">Showing {filtered.length} matching questions</span>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3 w-12 text-center">Order</th>
              <th className="p-3">Question Text</th>
              <th className="p-3 w-28">Type</th>
              <th className="p-3 w-24">Impact</th>
              <th className="p-3 w-20 text-center">Required</th>
              <th className="p-3 w-36">Mappings (Cats / Brands)</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((q: any) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="p-3 text-center font-bold text-slate-400">{q.order}</td>
                <td className="p-3 font-bold text-slate-800">{q.text}</td>
                <td className="p-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{q.type}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.impact === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{q.impact}</span></td>
                <td className="p-3 text-center text-emerald-500 font-bold">{q.required ? '✓' : '—'}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate">
                  {q.categories?.join(', ')} / {q.brands?.join(', ')}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleEditClick(q)} className="text-emerald-600 hover:text-emerald-800 font-bold">✏️ Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="text-rose-500 hover:text-rose-700 font-bold">🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">No questions mapped for this filter combo. Click "+ Add Question" to map one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl space-y-4 my-8 text-xs">
            <h4 className="font-bold text-sm border-b pb-2">Add Inspection Question</h4>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Question Title</label><input type="text" value={text} onChange={e => setText(e.target.value)} className="p-2 border rounded" placeholder="e.g. Camera Lens Scratched?" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Type</label><select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded"><option value="Single Select">Single Select</option><option value="Multi Select">Multi Select</option><option value="Text">Text Input</option></select></div>
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Impact Level</label><select value={impact} onChange={e => setImpact(e.target.value)} className="p-2 border rounded"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
              </div>

              {/* Multi select Checkbox for Categories */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Map to Categories (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border">
                  {availableCategories.map(c => (
                    <label key={c} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedCats.includes(c)} onChange={() => handleToggleMapping(c, mappedCats, setMappedCats)} className="rounded text-emerald-500" />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi select Checkbox for Brands */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Map to Brands (Multi-select)</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border max-h-24 overflow-y-auto">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedBrands.includes(b)} onChange={() => handleToggleMapping(b, mappedBrands, setMappedBrands)} className="rounded text-emerald-500" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi select Checkbox for Models */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Map to Models (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border max-h-24 overflow-y-auto">
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
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl space-y-4 my-8 text-xs">
            <h4 className="font-bold text-sm border-b pb-2">Edit Question - {selectedQuestion?.id}</h4>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Question Title</label><input type="text" value={text} onChange={e => setText(e.target.value)} className="p-2 border rounded" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Type</label><select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded"><option value="Single Select">Single Select</option><option value="Multi Select">Multi Select</option><option value="Text">Text Input</option></select></div>
                <div className="flex flex-col"><label className="font-bold text-slate-500 mb-1">Impact Level</label><select value={impact} onChange={e => setImpact(e.target.value)} className="p-2 border rounded"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
              </div>

              {/* Multi select Checkbox for Categories */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Map to Categories (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border">
                  {availableCategories.map(c => (
                    <label key={c} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedCats.includes(c)} onChange={() => handleToggleMapping(c, mappedCats, setMappedCats)} className="rounded text-emerald-500" />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi select Checkbox for Brands */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Map to Brands (Multi-select)</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border max-h-24 overflow-y-auto">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center space-x-1.5 cursor-pointer">
                      <input type="checkbox" checked={mappedBrands.includes(b)} onChange={() => handleToggleMapping(b, mappedBrands, setMappedBrands)} className="rounded text-emerald-500" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi select Checkbox for Models */}
              <div className="flex flex-col">
                <label className="font-bold text-slate-500 mb-1">Map to Models (Multi-select)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border max-h-24 overflow-y-auto">
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
                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition">Update Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
