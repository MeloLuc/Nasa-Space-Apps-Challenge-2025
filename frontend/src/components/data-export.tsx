import { Database, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatDataForExport, type Location, type WeatherData } from "@/data/mock-weather-data";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ExportData {
  location: Location
  dateRange: {
    startDate: string
    endDate: string
  };
  weatherData: WeatherData
  exportDate: string
}

interface DataExportProps {
  data: ExportData
}

export function DataExport({ data }: DataExportProps) {
  const getFormattedData = () => {
    return formatDataForExport(data.location, data.dateRange, data.weatherData)
  };

  const downloadJSON = () => {
    const exportData = getFormattedData()
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `weather-data-${data.location.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${data.dateRange.startDate}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  };

  const downloadCSV = () => {
    const exportData = getFormattedData()
    
    // Headers para CSV
    const headers = [
      'Date',
      'Temperature (°C)',
      'Precipitation (mm)',
      'Wind Speed (km/h)',
      'Humidity (%)',
      'Air Quality'
    ]
    
    // Dados para CSV
    const csvData = exportData.dailyForecast.map(day => [
      day.date,
      day.temperature,
      day.precipitation,
      day.windSpeed,
      day.humidity,
      day.airQuality
    ])
    
    // Criar conteúdo CSV
    const csvContent = [
      `# Weather Data Export`,
      `# Location: ${data.location.name} (${data.location.lat}, ${data.location.lng})`,
      `# Date Range: ${data.dateRange.startDate} to ${data.dateRange.endDate}`,
      `# Export Date: ${data.exportDate}`,
      `# Source: NASA Earth Observation Data (Mocked)`,
      '',
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
    const exportFileDefaultName = `weather-data-${data.location.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${data.dateRange.startDate}.csv`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  };

  const getDataSize = () => {
    const jsonString = JSON.stringify(getFormattedData())
    const sizeInBytes = new Blob([jsonString]).size
    return sizeInBytes < 1024 ? `${sizeInBytes} bytes` : `${(sizeInBytes / 1024).toFixed(1)} KB`
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Downloads
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do dataset */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Location:</span>
            <Badge variant="secondary">{data.location.name}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Period:</span>
            <Badge variant="secondary">
              {data.dateRange.startDate === data.dateRange.endDate 
                ? new Date(data.dateRange.startDate).toLocaleDateString('pt-BR')
                : `${new Date(data.dateRange.startDate).toLocaleDateString('pt-BR')} - ${new Date(data.dateRange.endDate).toLocaleDateString('pt-BR')}`
              }
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">source:</span>
            <Badge variant="outline">NASA Earth Observation</Badge>
          </div>
        </div>

        {/* Opções de download */}
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">JSON</h4>
                  <p className="text-sm text-muted-foreground">
                    Structured data with complete metadata
                  </p>
                </div>
              </div>
              <Button onClick={downloadJSON} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Includes weather probabilities, daily forecasts, and query metadata
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">CSV</h4>
                  <p className="text-sm text-muted-foreground">
                    Spreadsheet compatible with Excel and Google Sheets
                  </p>
                </div>
              </div>
              <Button onClick={downloadCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Tabular data with daily forecasts and informative commentary
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}