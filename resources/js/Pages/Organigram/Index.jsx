import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';

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

const avatarGradients = [
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-sky-500 to-blue-600',
    'from-cyan-500 to-teal-500',
    'from-fuchsia-500 to-pink-600',
    'from-lime-500 to-green-600',
];

function getAvatarGradient(name) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

const CARD_W = 240;
const GAP = 48;
const STEM = 28;

function buildTree(roots, globalMap) {
    const visited = new Set();
    const nodeMap = new Map();
    const parentMap = new Map();

    const allInCompany = flattenPeople(roots);
    const companyNames = new Set(allInCompany.map((n) => normalizeText(n.person.name)));

    const actualRoots = allInCompany.filter((node) => {
        const selfName = normalizeText(node.person.name);
        const supName = normalizeText(node.person.supervisor_name);
        return !supName || supName === selfName || !companyNames.has(supName);
    });

    function walk(node) {
        const id = node.person.key;
        if (visited.has(id)) return null;
        visited.add(id);

        const selfName = normalizeText(node.person.name);
        const children = Array.from(globalMap.values())
            .filter(
                (p) =>
                    normalizeText(p.person.supervisor_name) === selfName &&
                    normalizeText(p.person.name) !== selfName
            )
            .map((child) => {
                const childNode = walk(child);
                if (childNode) parentMap.set(childNode.id, id);
                return childNode;
            })
            .filter(Boolean);

        const treeNode = {
            id,
            person: node.person,
            children,
            directReportsCount: children.length,
        };
        nodeMap.set(id, treeNode);
        return treeNode;
    }

    const rootsOut = actualRoots.map((node) => walk(node)).filter(Boolean);

    return { roots: rootsOut, nodeMap, parentMap, totalPeople: allInCompany.length };
}

function hasVisibleDescendant(treeNode, expandedSet) {
    if (!expandedSet.has(treeNode.id)) return false;
    return treeNode.children.some(
        (c) => expandedSet.has(c.id) || hasVisibleDescendant(c, expandedSet)
    );
}

function PersonCard({ person, isExpanded, hasChildren, isHighlighted, directReportsCount, onToggle }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(null)}
            style={{ width: CARD_W }}
            className={`relative transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isHovered ? 'scale-[1.02]' : 'scale-100'
            } ${isHighlighted ? 'z-10' : 'z-0'}`}
        >
            <div
                className={`rounded-2xl p-[1px] transition-all duration-300 ${
                    isHighlighted
                        ? 'bg-gradient-to-r from-violet-400 to-purple-500 shadow-lg shadow-violet-200/50'
                        : isHovered
                          ? 'bg-gradient-to-r from-gray-200 to-gray-100 shadow-md'
                          : 'bg-gray-100'
                }`}
            >
                <div className="flex items-center gap-3 rounded-[calc(1rem-1px)] bg-white px-4 py-3">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(person.name)} text-sm font-bold text-white shadow-inner transition-transform duration-300 ${
                            isHovered ? 'scale-105' : 'scale-100'
                        }`}
                    >
                        {person.name?.charAt(0)}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="truncate text-[13px] font-semibold leading-tight text-gray-900">
                            {person.name}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-gray-400">
                            {person.position || 'SIN CARGO'}
                        </p>
                        {person.cost_center && (
                            <p className="mt-0.5 truncate text-[9px] text-gray-300">
                                {person.cost_center}
                            </p>
                        )}
                    </div>

                    {hasChildren && (
                        <button
                            onClick={onToggle}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold leading-none transition-all duration-300 ${
                                isExpanded
                                    ? 'bg-violet-100 text-violet-600'
                                    : 'bg-gray-100 text-gray-400 hover:bg-violet-50 hover:text-violet-500'
                            }`}
                        >
                            {isExpanded ? '−' : '+'}
                        </button>
                    )}
                </div>
            </div>

            {hasChildren && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-gray-400 shadow-sm ring-1 ring-gray-100">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {directReportsCount}
                    </span>
                </div>
            )}
        </div>
    );
}

function TreeNode({ treeNode, expandedSet, onToggle, highlightedNode }) {
    const { id, person, children, directReportsCount } = treeNode;
    const hasChildren = children.length > 0;
    const isExpanded = expandedSet.has(id);
    const isHighlighted = highlightedNode === id;

    return (
        <div className="flex flex-col items-center">
            <PersonCard
                person={person}
                isExpanded={isExpanded}
                hasChildren={hasChildren}
                isHighlighted={isHighlighted}
                directReportsCount={directReportsCount}
                onToggle={() => onToggle(id)}
            />

            {hasChildren && isExpanded && (
                <>
                    <div className="w-0.5 bg-gray-200" style={{ height: STEM }} />

                    <div className="relative flex flex-row items-start" style={{ gap: GAP }}>
                        <div className="pointer-events-none absolute top-0 left-0 right-0 h-0.5 bg-gray-200" />

                        {children.map((child) => (
                            <div key={child.id} className="relative flex flex-col items-center">
                                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200" style={{ height: STEM }} />
                                <TreeNode
                                    treeNode={child}
                                    expandedSet={expandedSet}
                                    onToggle={onToggle}
                                    highlightedNode={highlightedNode}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function CompanyOrganigram({ company, globalMap }) {
    const tree = useMemo(() => buildTree(company.roots ?? [], globalMap), [company, globalMap]);
    const [expandedSet, setExpandedSet] = useState(() => new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedNode, setHighlightedNode] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        setExpandedSet(new Set(tree.roots.map((r) => r.id)));
    }, [tree]);

    const onToggle = useCallback((id) => {
        setExpandedSet((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const expandAll = useCallback(() => {
        const all = new Set();
        const walk = (n) => {
            all.add(n.id);
            n.children.forEach(walk);
        };
        tree.roots.forEach(walk);
        setExpandedSet(all);
    }, [tree]);

    const collapseAll = useCallback(() => {
        setExpandedSet(new Set(tree.roots.map((r) => r.id)));
    }, [tree]);

    const handleSearch = useCallback(
        (term) => {
            setSearchTerm(term);
            if (!term.trim()) {
                setHighlightedNode(null);
                return;
            }

            const normalizedTerm = normalizeText(term);
            let foundId = null;

            for (const [id, node] of tree.nodeMap) {
                const name = normalizeText(node.person.name);
                const position = normalizeText(node.person.position);
                if (name.includes(normalizedTerm) || position.includes(normalizedTerm)) {
                    foundId = id;
                    break;
                }
            }

            if (foundId) {
                setHighlightedNode(foundId);
                setExpandedSet((prev) => {
                    const next = new Set(prev);
                    let currentId = foundId;
                    while (tree.parentMap.has(currentId)) {
                        const parentId = tree.parentMap.get(currentId);
                        next.add(parentId);
                        currentId = parentId;
                    }
                    next.add(foundId);
                    return next;
                });
            } else {
                setHighlightedNode(null);
            }
        },
        [tree]
    );

    const totalNodes = tree.nodeMap.size;

    return (
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white px-6 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold tracking-tight text-gray-900">{company.name}</h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-600 ring-1 ring-violet-200/50">
                                {totalNodes}
                            </span>
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
                            Estructura Organizativa
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="h-9 w-44 rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-[12px] text-gray-600 placeholder:text-gray-300 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100/50"
                            />
                        </div>
                        <button
                            onClick={expandAll}
                            className="rounded-xl px-3 py-[7px] text-[11px] font-medium text-gray-500 ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:text-gray-700"
                        >
                            Expandir
                        </button>
                        <button
                            onClick={collapseAll}
                            className="rounded-xl px-3 py-[7px] text-[11px] font-medium text-gray-500 ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:text-gray-700"
                        >
                            Colapsar
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto" ref={scrollRef}>
                <div className="flex justify-center py-8 min-w-min px-6">
                    {tree.roots.length > 0 ? (
                        <div className="flex flex-col items-center gap-0">
                            {tree.roots.map((root, i) => (
                                <div key={root.id} className="flex flex-col items-center">
                                    {i > 0 && <div className="h-4" />}
                                    <TreeNode
                                        treeNode={root}
                                        expandedSet={expandedSet}
                                        onToggle={onToggle}
                                        highlightedNode={highlightedNode}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                            Sin datos jerárquicos para esta empresa
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function Index({ snapshot, currentImport }) {
    const companies = snapshot?.companies ?? [];

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

    const statCards = [
        {
            label: 'Total Colaboradores',
            value: totalStats.totalPeople,
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            gradient: 'from-violet-500 to-purple-600',
            lightBg: 'bg-violet-50',
            lightText: 'text-violet-600',
        },
        {
            label: 'Empresas',
            value: totalStats.companiesCount,
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            gradient: 'from-emerald-500 to-teal-600',
            lightBg: 'bg-emerald-50',
            lightText: 'text-emerald-600',
        },
        {
            label: 'Última Actualización',
            value: currentImport
                ? new Date(currentImport.created_at).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                  })
                : '—',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            gradient: 'from-sky-500 to-blue-600',
            lightBg: 'bg-sky-50',
            lightText: 'text-sky-600',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </span>
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-gray-900">Organigrama</h2>
                        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">Panel de Estructura Organizativa</p>
                    </div>
                </div>
            }
        >
            <Head title="Organigrama" />
            <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1400px] space-y-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {statCards.map((stat, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-md">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400">{stat.label}</p>
                                        <p className={`mt-1.5 text-2xl font-bold tracking-tight ${stat.lightText}`}>{stat.value}</p>
                                    </div>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.lightBg} transition-transform duration-300 group-hover:scale-105`}>
                                        <svg className={`h-5 w-5 ${stat.lightText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {companies.map((company) => (
                        <CompanyOrganigram key={company.slug} company={company} globalMap={globalMap} />
                    ))}

                    {companies.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                <svg className="h-7 w-7 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <p className="mt-4 text-sm font-medium text-gray-500">No hay organigramas cargados</p>
                            <p className="mt-1 text-xs text-gray-400">Contacta al administrador para subir uno.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
