import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import RelationGraph from 'relation-graph-react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';



// --- UTILIDADES ---
function normalizeText(value) {
    return (value || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function flattenPeople(roots) {
    let results = [];
    roots.forEach((root) => {
        results.push(root);
        if (root.children && root.children.length > 0) {
            results = results.concat(flattenPeople(root.children));
        }
    });
    return results;
}

// --- COMPONENTE DE NODO ESTILIZADO ---

// --- COMPONENTE DE EMPRESA ---
function CompanyOrganigram({ company, globalMap }) {
    const graphRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [highlightedNode, setHighlightedNode] = useState(null);

// Definición del Slot del Nodo
    const MyNodeSlot = ({ node }) => {
        // Ignorar raíz virtual
        if (node.data?.isVirtualRoot) return <div className="h-1 w-1 opacity-0" />;

        const person = node.data?.person;
        const hasChildren = node.data?.directReportsCount > 0;

        if (!person) return null;

        const toggleNode = (e) => {
            e.stopPropagation();
            const instance = graphRef.current?.getInstance();
            if (instance) instance.toggleNodeExpanded(node);
        };

        const isHighlighted = highlightedNode && highlightedNode === node.id;

        return (
            <div
                className={`relative flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all duration-300 ${
                    hasChildren ? 'bg-white border-emerald-200' : 'bg-slate-50 border-slate-200'
                } ${isHighlighted ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}
                style={{ width: '320px', height: '80px', overflow: 'hidden' }}
            >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    person.sex === 'F' ? 'bg-rose-400' : 'bg-emerald-600'
                }`}>
                    {person.name?.charAt(0)}
                </div>

                {/* Contenedor de Texto: AQUÍ ESTÁ EL POSITION */}
                <div className="flex-1 min-w-0 flex flex-col justify-center items-start text-left">
                    <p className="w-full truncate text-[13px] font-bold text-slate-800 m-0 p-0 leading-tight">
                        {person.name}
                    </p>
                    <p className="w-full truncate text-[11px] font-bold text-emerald-600 uppercase mt-1 leading-none block italic">
                        {person.position || 'CARGO NO DEFINIDO'}
                    </p>
                    <p className="w-full truncate text-[9px] text-slate-400 mt-1 leading-none">
                        {person.cost_center}
                    </p>
                </div>

                {/* Botón Expansión */}
                {hasChildren && (
                    <button
                        onClick={toggleNode}
                        className="flex-shrink-0 w-8 h-8 flex flex-col items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                    >
                        <span className="text-[14px] font-bold leading-none">{node.expanded ? '−' : '+'}</span>
                        <span className="text-[8px] font-bold">{node.data.directReportsCount}</span>
                    </button>
                )}
            </div>
        );
    };

    const graphData = useMemo(() => {
        const allInCompany = flattenPeople(company.roots || []);
        const nodes = [];
        const lines = [];
        const visited = new Set();
        const companyNames = new Set(allInCompany.map(n => normalizeText(n.person.name)));

        const rootsOfThisCompany = allInCompany.filter(node => {
            const selfName = normalizeText(node.person.name);
            const supervisorName = normalizeText(node.person.supervisor_name);
            return !supervisorName || supervisorName === selfName || !companyNames.has(supervisorName);
        });

        const walk = (node) => {
            const id = node.person.key;
            if (visited.has(id)) return;
            visited.add(id);

            const selfName = normalizeText(node.person.name);
            const children = Array.from(globalMap.values()).filter(p =>
                normalizeText(p.person.supervisor_name) === selfName &&
                normalizeText(p.person.name) !== selfName
            );

            nodes.push({
                id,
                text: node.person.name+' - '+node.person.position,
                expanded: false,
                data: {
                    person: node.person,
                    directReportsCount: children.length,
                    isVirtualRoot: false,
                },
            });

            children.forEach((child) => {
                lines.push({ from: id, to: child.person.key });
                walk(child);
            });
        };

        const vId = `v-${company.slug}`;
        nodes.push({ id: vId, text: '', data: { isVirtualRoot: true }, expanded: true });

        rootsOfThisCompany.forEach(root => {
            lines.push({ from: vId, to: root.person.key });
            walk(root);
        });

        return { rootId: vId, nodes, lines };
    }, [company, globalMap]);

    useEffect(() => {
        if (graphData.nodes.length > 1 && graphRef.current) {
            graphRef.current.setJsonData(graphData);
        }
    }, [graphData]);

    // Funciones para expandir/colapsar todo
    const expandAllNodes = useCallback(() => {
        const instance = graphRef.current?.getInstance();
        if (instance) {
            graphData.nodes.forEach(node => {
                if (!node.data?.isVirtualRoot && node.data?.directReportsCount > 0) {
                    instance.expandNode(node.id);
                }
            });
        }
    }, [graphData]);

    const collapseAllNodes = useCallback(() => {
        const instance = graphRef.current?.getInstance();
        if (instance) {
            graphData.nodes.forEach(node => {
                if (!node.data?.isVirtualRoot && node.data?.directReportsCount > 0) {
                    instance.collapseNode(node.id);
                }
            });
        }
    }, [graphData]);

    // Búsqueda y resaltado de personas
    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setHighlightedNode(null);
            return;
        }

        const searchTermLower = term.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
        const found = graphData.nodes.find(node => {
            if (node.data?.isVirtualRoot) return false;
            const personName = (node.data?.person?.name || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
            const personPosition = (node.data?.person?.position || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
            return personName.includes(searchTermLower) || personPosition.includes(searchTermLower);
        });

        if (found) {
            setHighlightedNode(found.id);
            const instance = graphRef.current?.getInstance();
            if (instance) {
                instance.focusNodeById(found.id);
                // Expandir padres si es necesario
                let currentId = found.id;
                let parent = graphData.nodes.find(n => 
                    graphData.lines.some(l => l.from === n.id && l.to === currentId)
                );
                while (parent) {
                    instance.expandNode(parent.id);
                    currentId = parent.id;
                    parent = graphData.nodes.find(n => 
                        graphData.lines.some(l => l.from === n.id && l.to === currentId)
                    );
                }
            }
        } else {
            setHighlightedNode(null);
        }
    }, [graphData]);

    const graphOptions = {
        layout: {
            layoutName: 'folder',
            from: 'left',
            min_per_width: 340,
            min_per_height: 80,
        },


    defaultNodeShape: 1,
    defaultLineShape: 41,
    defaultPolyLineRadius: 4,
    defaultExpandHolderPosition: 'right',
    defaultBottomJuctionPoint_X: 28,
    defaultJunctionPoint: 'lr',
    defaultNodeBorderWidth: 0,
    defaultLineColor: 'rgba(0, 186, 189, 1)',
    defaultNodeColor: 'rgba(0, 206, 209, 1)',
    reLayoutWhenExpandedOrCollapsed: true,
    };

    return (
        <section className="mb-12  border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex flex-col gap-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{company.name}</h2>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Estructura Organizativa</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            {graphData.nodes.length - 1} Colaboradores
                        </span>
                    </div>
                </div>
                
                {/* Barra de búsqueda y controles */}
                <div className="flex gap-2 items-center flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <TextInput
                            type="text"
                            placeholder="Buscar persona o cargo..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <SecondaryButton onClick={expandAllNodes} className="text-xs">
                        Expandir todo
                    </SecondaryButton>
                    <SecondaryButton onClick={collapseAllNodes} className="text-xs">
                        Colapsar todo
                    </SecondaryButton>
                </div>
            </div>
            <div style={{ height: '600px', width: '100%' }}>
                <RelationGraph
                    ref={graphRef}
                    options={graphOptions}
                    NodeSlot={MyNodeSlot}

                />
            </div>
        </section>
    );
}

// --- PÁGINA PRINCIPAL ---
export default function Index({ snapshot, currentImport }) {
    const companies = snapshot?.companies ?? [];
    
    // Calcular estadísticas totales
    const totalStats = useMemo(() => {
        let totalPeople = 0;
        companies.forEach((c) => {
            const flat = flattenPeople(c.roots || []);
            totalPeople += flat.length;
        });
        return { totalPeople, companiesCount: companies.length };
    }, [companies]);

    const globalMap = useMemo(() => {
        const map = new Map();
        companies.forEach((c) => {
            const flat = flattenPeople(c.roots || []);
            flat.forEach((node) => {
                const key = normalizeText(node.person?.name);
                if (key) map.set(key, node);
            });
        });
        return map;
    }, [companies]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold text-slate-800 tracking-tight italic">Panel de Organigramas</h2>}
        >
            <Head title="Organigrama" />
            <div className="py-10 bg-[#fbfcfd] min-h-screen px-6">
                <div className="mx-auto max-w-[1500px] space-y-12">
                    {/* Estadísticas generales */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Total Colaboradores</dt>
                            <dd className="mt-2 text-2xl font-bold text-emerald-700">{totalStats.totalPeople}</dd>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Empresas</dt>
                            <dd className="mt-2 text-2xl font-bold text-emerald-700">{totalStats.companiesCount}</dd>
                        </div>
                        {currentImport && (
                            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Última Actualización</dt>
                                <dd className="mt-2 text-sm font-medium text-emerald-700">
                                    {new Date(currentImport.created_at).toLocaleDateString('es-CL', { 
                                        day: '2-digit', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })}
                                </dd>
                            </div>
                        )}
                    </div>

                    {companies.map((company) => (
                        <CompanyOrganigram key={company.slug} company={company} globalMap={globalMap} />
                    ))}

                    {companies.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                            <p className="text-slate-500">No hay organigramas cargados. Contacta al administrador para subir uno.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
