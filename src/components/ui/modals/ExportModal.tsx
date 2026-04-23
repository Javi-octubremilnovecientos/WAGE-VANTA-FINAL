import { useState } from 'react';
import { ArrowDownTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { BoxPlotData } from '@/features/salaries/types';

type ExportFormat = 'png' | 'pdf' | 'csv';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Datos del gráfico para exportar */
    chartData: BoxPlotData[];
    /** Salario mensual del usuario (opcional, para incluir en la línea de referencia) */
    userWage?: number | null;
    /** Si el usuario puede exportar (validación de plan Premium) */
    canExport: boolean;
    /** Callback para mostrar modal de upgrade si no puede exportar */
    onUpgradeRequired: () => void;
}

/**
 * Modal de exportación de gráficos y datos.
 * 
 * - Si el usuario NO puede exportar (Guest/FREE): muestra mensaje de Premium y botón upgrade
 * - Si el usuario SÍ puede exportar (Premium): muestra opciones de exportación PNG, PDF, CSV
 * 
 * @example
 * ```tsx
 * <ExportModal
 *   isOpen={exportModalOpen}
 *   onClose={() => setExportModalOpen(false)}
 *   chartData={chartData}
 *   userWage={userWage}
 *   canExport={canExport}
 *   onUpgradeRequired={() => {
 *     setExportModalOpen(false);
 *     setUpgradeModalOpen(true);
 *   }}
 * />
 * ```
 */
export default function ExportModal({
    isOpen,
    onClose,
    chartData,
    userWage,
    canExport,
    onUpgradeRequired,
}: ExportModalProps) {
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    /**
     * Exporta como CSV simple con los datos de BoxPlot
     */
    const handleExportCSV = () => {
        setIsExporting(true);
        try {
            // Crear CSV con headers y filas
            const headers = ['Country', 'Min', 'Q1', 'Median', 'Q3', 'Max'];
            const rows = chartData.map((data) => [
                data.category,
                data.min.toFixed(2),
                data.q1.toFixed(2),
                data.median.toFixed(2),
                data.q3.toFixed(2),
                data.max.toFixed(2),
            ]);

            // Agregar línea de referencia si existe userWage
            if (userWage) {
                rows.push(['', '', '', '', '', '']);
                rows.push(['User Monthly Wage', userWage.toFixed(2), '', '', '', '']);
            }

            const csvContent = [
                headers.join(','),
                ...rows.map((row) => row.join(',')),
            ].join('\n');

            // Crear blob y descargar
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `wage_comparison_${Date.now()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            onClose();
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Error exporting CSV. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Exporta como PNG (requiere librería externa como html2canvas)
     * Por ahora, muestra un placeholder
     */
    const handleExportPNG = () => {
        alert('PNG export coming soon! This feature requires html2canvas library.');
        // TODO: Implementar con html2canvas
        // setIsExporting(true);
        // const chartElement = document.getElementById('main-chart');
        // if (chartElement) {
        //     html2canvas(chartElement).then((canvas) => {
        //         const link = document.createElement('a');
        //         link.download = `wage_comparison_${Date.now()}.png`;
        //         link.href = canvas.toDataURL();
        //         link.click();
        //         setIsExporting(false);
        //         onClose();
        //     });
        // }
    };

    /**
     * Exporta como PDF (requiere librería externa como jsPDF)
     * Por ahora, muestra un placeholder
     */
    const handleExportPDF = () => {
        alert('PDF export coming soon! This feature requires jsPDF library.');
        // TODO: Implementar con jsPDF
        // setIsExporting(true);
        // const doc = new jsPDF();
        // doc.text('Wage Comparison', 10, 10);
        // chartData.forEach((data, index) => {
        //     doc.text(`${data.category}: ${data.median}`, 10, 20 + index * 10);
        // });
        // doc.save(`wage_comparison_${Date.now()}.pdf`);
        // setIsExporting(false);
        // onClose();
    };

    const exportOptions: { format: ExportFormat; label: string; handler: () => void; available: boolean }[] = [
        { format: 'csv', label: 'Export as CSV', handler: handleExportCSV, available: true },
        { format: 'png', label: 'Export as PNG', handler: handleExportPNG, available: false }, // Placeholder
        { format: 'pdf', label: 'Export as PDF', handler: handleExportPDF, available: false }, // Placeholder
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
        >
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-xl">
                {/* Title */}
                <h2
                    id="export-modal-title"
                    className="text-lg font-bold mb-3 text-gray-900 dark:text-white"
                >
                    Export Comparison
                </h2>

                {/* Si NO puede exportar: mostrar mensaje de upgrade */}
                {!canExport ? (
                    <div className="space-y-4">
                        <div className="rounded-lg border border-yellow-600/50 bg-yellow-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <SparklesIcon className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-300 mb-1">
                                        Export is a Premium feature
                                    </p>
                                    <p className="text-xs text-yellow-200/80">
                                        Upgrade to Premium to export comparisons as CSV, PDF, or PNG files.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onClose();
                                    onUpgradeRequired();
                                }}
                                className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-white bg-[#45D2FD] hover:bg-[#22b8d9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#45D2FD] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                            >
                                Upgrade to Premium
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Si SÍ puede exportar: mostrar opciones de exportación */
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">
                            Choose export format for your comparison data:
                        </p>

                        {/* Botones de exportación */}
                        <div className="space-y-2">
                            {exportOptions.map((option) => (
                                <button
                                    key={option.format}
                                    onClick={option.handler}
                                    disabled={!option.available || isExporting}
                                    className="w-full flex items-center justify-between gap-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/40 px-4 py-3 text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-[#45d2fd]/50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {option.label}
                                    </span>
                                    <ArrowDownTrayIcon className="h-4 w-4 text-gray-400" />
                                </button>
                            ))}
                        </div>

                        {/* Info sobre formatos no disponibles */}
                        <p className="text-xs text-gray-500 text-center">
                            PNG and PDF export coming soon
                        </p>

                        {/* Botón de cerrar */}
                        <button
                            onClick={onClose}
                            disabled={isExporting}
                            className="w-full rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
