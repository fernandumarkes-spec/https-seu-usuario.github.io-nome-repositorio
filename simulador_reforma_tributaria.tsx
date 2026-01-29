import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, FileText, DollarSign, RefreshCw, FileDown } from 'lucide-react';

export default function SimuladorReformaTributaria() {
  const [premissas, setPremissas] = useState({
    faturamento: 120000,
    folhaPagamento: 35000,
    baseCreditoLucroReal: 45000,
    aliquotaCreditoLucroReal: 3.65,
    baseCreditoReforma: 60000,
    aliquotaCreditoReforma: 8.5
  });

  const [receitas, setReceitas] = useState({
    pratos: { valor: 50000, pisCofins: 3.65, cbs: 8.5 },
    cervejas: { valor: 30000, pisCofins: 3.65, cbs: 8.5 },
    refrigerantes: { valor: 10000, pisCofins: 3.65, cbs: 8.5 },
    coqueteis: { valor: 15000, pisCofins: 3.65, cbs: 8.5 },
    bebidasQuentes: { valor: 8000, pisCofins: 3.65, cbs: 8.5 }
  });

  const [compras, setCompras] = useState({
    hortifruti: { valor: 12000, pisCofins: 3.65, cbs: 8.5 },
    proteinas: { valor: 18000, pisCofins: 3.65, cbs: 8.5 },
    demaisInsumos: { valor: 8000, pisCofins: 3.65, cbs: 8.5 }
  });

  const [despesas, setDespesas] = useState({
    folhaPagamento: { valor: 35000, pisCofins: 0 },
    aluguel: { valor: 8000, pisCofins: 0 },
    energia: { valor: 3000, pisCofins: 0 },
    outras: { valor: 5000, pisCofins: 0 }
  });

  const [creditoCBSDespesas, setCreditoCBSDespesas] = useState(9.50);

  const [ivaCreditos, setIvaCreditos] = useState([
    { faixa: 'Faixa 1', base: 12000, aliquota: 2.0 },
    { faixa: 'Faixa 2', base: 15000, aliquota: 3.5 },
    { faixa: 'Faixa 3', base: 10000, aliquota: 5.0 },
    { faixa: 'Faixa 4', base: 8000, aliquota: 6.5 },
    { faixa: 'Faixa 5', base: 6000, aliquota: 7.5 },
    { faixa: 'Faixa 6', base: 4000, aliquota: 9.5 }
  ]);

  const calculos = useMemo(() => {
    const totalReceita = Object.values(receitas).reduce((acc, r) => acc + r.valor, 0);
    
    const pisCofinsReceita = Object.values(receitas).reduce(
      (acc, r) => acc + (r.valor * r.pisCofins / 100), 0
    );

    const creditoCBSCompras = Object.values(compras).reduce(
      (acc, c) => acc + (c.valor * c.cbs / 100), 0
    );

    const totalDespesas = Object.values(despesas).reduce((acc, d) => acc + d.valor, 0);
    
    const creditoCBSDespesasValor = totalDespesas * (creditoCBSDespesas / 100);

    const creditoCBSIva = ivaCreditos.reduce(
      (acc, faixa) => acc + (faixa.base * faixa.aliquota / 100), 0
    );

    const creditoLucroReal = premissas.baseCreditoLucroReal * (premissas.aliquotaCreditoLucroReal / 100);
    const creditoReforma = premissas.baseCreditoReforma * (premissas.aliquotaCreditoReforma / 100);

    const cbsReceita = Object.values(receitas).reduce(
      (acc, r) => acc + (r.valor * r.cbs / 100), 0
    );

    const creditoCBSTotal = creditoCBSCompras + creditoCBSDespesasValor + creditoCBSIva + creditoReforma;
    const cbsDevido = cbsReceita - creditoCBSTotal;

    const totalCompras = Object.values(compras).reduce((acc, c) => acc + c.valor, 0);

    return {
      totalReceita,
      pisCofinsReceita,
      cbsReceita,
      creditoCBSCompras,
      creditoCBSDespesasValor,
      creditoCBSIva,
      creditoLucroReal,
      creditoReforma,
      creditoCBSTotal,
      cbsDevido,
      totalCompras,
      totalDespesas,
      diferencaTributaria: cbsDevido - pisCofinsReceita,
      percentualDiferenca: ((cbsDevido - pisCofinsReceita) / pisCofinsReceita * 100)
    };
  }, [receitas, compras, despesas, creditoCBSDespesas, ivaCreditos, premissas]);

  const updatePremissa = (field, value) => {
    setPremissas(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const updateReceita = (key, field, value) => {
    setReceitas(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: parseFloat(value) || 0 }
    }));
  };

  const updateCompra = (key, field, value) => {
    setCompras(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: parseFloat(value) || 0 }
    }));
  };

  const updateDespesa = (key, field, value) => {
    setDespesas(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: parseFloat(value) || 0 }
    }));
  };

  const updateIvaCredito = (index, field, value) => {
    setIvaCreditos(prev =>
      prev.map((faixa, i) =>
        i === index ? { ...faixa, [field]: parseFloat(value) || 0 } : faixa
      )
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAtualizar = () => {
    alert('Dados atualizados com sucesso!');
  };

  const handleExportarPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Simulador da Reforma Tributária - Restaurantes
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* RECEITAS */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Premissas Gerais</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Faturamento</label>
                    <input
                      type="number"
                      value={premissas.faturamento}
                      onChange={(e) => updatePremissa('faturamento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Valor R$"
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Folha de Pagamento</label>
                    <input
                      type="number"
                      value={premissas.folhaPagamento}
                      onChange={(e) => updatePremissa('folhaPagamento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Valor R$"
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base de Crédito (Lucro Real)</label>
                    <input
                      type="number"
                      value={premissas.baseCreditoLucroReal}
                      onChange={(e) => updatePremissa('baseCreditoLucroReal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Valor R$"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="9.5"
                      value={premissas.aliquotaCreditoLucroReal}
                      onChange={(e) => updatePremissa('aliquotaCreditoLucroReal', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="0.00 a 9.50"
                    />
                    <span className="text-xs text-gray-500">Alíquota PIS/COFINS %</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base de Crédito (Reforma)</label>
                    <input
                      type="number"
                      value={premissas.baseCreditoReforma}
                      onChange={(e) => updatePremissa('baseCreditoReforma', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Valor R$"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="9.5"
                      value={premissas.aliquotaCreditoReforma}
                      onChange={(e) => updatePremissa('aliquotaCreditoReforma', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="0.00 a 9.50"
                    />
                    <span className="text-xs text-gray-500">Alíquota CBS %</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Alíquotas entre 0,00% e 9,50% para simular cenários de crédito.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Receitas
                </h2>
                
                {Object.entries(receitas).map(([key, data]) => (
                  <div key={key} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="number"
                          value={data.valor}
                          onChange={(e) => updateReceita(key, 'valor', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Valor R$"
                        />
                        <span className="text-xs text-gray-500">Receita</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="9.5"
                          value={data.pisCofins}
                          onChange={(e) => updateReceita(key, 'pisCofins', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="%"
                        />
                        <span className="text-xs text-gray-500">PIS/COFINS %</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="9.5"
                          value={data.cbs}
                          onChange={(e) => updateReceita(key, 'cbs', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="%"
                        />
                        <span className="text-xs text-gray-500">CBS %</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* COMPRAS */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Compras (Créditos)
                </h2>
                
                {Object.entries(compras).map(([key, data]) => (
                  <div key={key} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="number"
                          value={data.valor}
                          onChange={(e) => updateCompra(key, 'valor', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Valor R$"
                        />
                        <span className="text-xs text-gray-500">Compra</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="9.5"
                          value={data.pisCofins}
                          onChange={(e) => updateCompra(key, 'pisCofins', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="%"
                        />
                        <span className="text-xs text-gray-500">Crédito PIS/COFINS %</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="9.5"
                          value={data.cbs}
                          onChange={(e) => updateCompra(key, 'cbs', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="%"
                        />
                        <span className="text-xs text-gray-500">Crédito CBS %</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESPESAS E DASHBOARD */}
            <div className="space-y-6">
              {/* DESPESAS */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-orange-800 mb-4">Despesas Operacionais</h2>
                
                {Object.entries(despesas).map(([key, data]) => (
                  <div key={key} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="number"
                          value={data.valor}
                          onChange={(e) => updateDespesa(key, 'valor', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Valor R$"
                        />
                        <span className="text-xs text-gray-500">Valor</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="9.5"
                          value={data.pisCofins}
                          onChange={(e) => updateDespesa(key, 'pisCofins', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="%"
                        />
                        <span className="text-xs text-gray-500">PIS/COFINS %</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="9.50"
                          value={creditoCBSDespesas}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val >= 0 && val <= 9.50) {
                              setCreditoCBSDespesas(val);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00 a 9.50"
                        />
                        <span className="text-xs text-gray-500">Crédito CBS %</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DASHBOARD */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Dashboard Comparativo
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(calculos.totalReceita)}</p>
                    <p className="text-xs text-gray-500 mt-1">Premissa de faturamento: {formatCurrency(premissas.faturamento)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">PIS/COFINS a Recolher</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculos.pisCofinsReceita)}</p>
                    <p className="text-xs text-gray-500 mt-1">Sistema Atual</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">CBS sobre Receitas</p>
                    <p className="text-xl font-semibold text-gray-700">{formatCurrency(calculos.cbsReceita)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">Créditos CBS - Compras</p>
                    <p className="text-xl font-semibold text-green-600">- {formatCurrency(calculos.creditoCBSCompras)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">Créditos CBS - Despesas ({creditoCBSDespesas.toFixed(2)}%)</p>
                    <p className="text-xl font-semibold text-green-600">- {formatCurrency(calculos.creditoCBSDespesasValor)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">Créditos CBS - Faixas IVA</p>
                    <p className="text-xl font-semibold text-green-600">- {formatCurrency(calculos.creditoCBSIva)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">Crédito PIS/COFINS (Lucro Real)</p>
                    <p className="text-xl font-semibold text-green-600">- {formatCurrency(calculos.creditoLucroReal)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">Crédito CBS (Base Reforma)</p>
                    <p className="text-xl font-semibold text-green-600">- {formatCurrency(calculos.creditoReforma)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-300">
                    <p className="text-sm text-gray-600">Total Créditos CBS</p>
                    <p className="text-xl font-bold text-green-700">- {formatCurrency(calculos.creditoCBSTotal)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">CBS a Recolher (Líquido)</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(calculos.cbsDevido)}</p>
                    <p className="text-xs text-gray-500 mt-1">Nova Reforma Tributária</p>
                  </div>

                  <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                    calculos.diferencaTributaria > 0 ? 'border-red-500' : 'border-green-500'
                  }`}>
                    <p className="text-sm text-gray-600">Diferença (CBS - PIS/COFINS)</p>
                    <p className={`text-2xl font-bold ${
                      calculos.diferencaTributaria > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {calculos.diferencaTributaria > 0 ? '+' : ''}{formatCurrency(calculos.diferencaTributaria)}
                    </p>
                    <p className="text-sm mt-1">
                      <span className={calculos.diferencaTributaria > 0 ? 'text-red-600' : 'text-green-600'}>
                        {calculos.diferencaTributaria > 0 ? 'Aumento' : 'Redução'} de {Math.abs(calculos.percentualDiferenca).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">Faixas de Crédito CBS (IVA)</h2>
            <p className="text-sm text-emerald-700 mb-4">
              Defina até 6 variações de crédito de IVA com alíquotas entre 0,00% e 9,50%.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {ivaCreditos.map((faixa, index) => (
                <div key={faixa.faixa} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{faixa.faixa}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        value={faixa.base}
                        onChange={(e) => updateIvaCredito(index, 'base', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Base R$"
                      />
                      <span className="text-xs text-gray-500">Base de crédito</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="9.5"
                        value={faixa.aliquota}
                        onChange={(e) => updateIvaCredito(index, 'aliquota', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="0.00 a 9.50"
                      />
                      <span className="text-xs text-gray-500">Alíquota %</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-8 flex gap-4 justify-center print:hidden">
            <button
              onClick={handleAtualizar}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Atualizar Dados
            </button>
            
            <button
              onClick={handleExportarPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <FileDown className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>

          {/* Instruções GitHub */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📦 Como Publicar no GitHub</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li><strong>1.</strong> Crie um repositório no GitHub</li>
              <li><strong>2.</strong> Copie este código para um arquivo <code className="bg-gray-200 px-2 py-1 rounded">index.html</code></li>
              <li><strong>3.</strong> Faça commit e push para o repositório</li>
              <li><strong>4.</strong> Ative GitHub Pages nas configurações do repositório</li>
              <li><strong>5.</strong> Acesse via: <code className="bg-gray-200 px-2 py-1 rounded">https://seu-usuario.github.io/nome-repositorio</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
