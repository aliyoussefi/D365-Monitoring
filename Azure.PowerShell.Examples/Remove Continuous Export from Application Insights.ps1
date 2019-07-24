#References
#https://docs.microsoft.com/en-us/powershell/module/az.applicationinsights/set-azapplicationinsightscontinuousexport?view=azps-2.4.0#parameters



# Connect to Azure with a browser sign in token
#Connect-AzAccount

$exportId = Get-AzApplicationInsightsContinuousExport -ResourceGroupName "Dynamics365andAzure" -Name "Dynamics365-Telemetry"

If ($exportId.IsEnabled = "True"){

#Set-AzApplicationInsightsContinuousExport -ResourceGroupName "Dynamics365andAzure" -Name "Dynamics365-Telemetry" -ExportId $exportId.ExportId #-DisableConfiguration
Remove-AzApplicationInsightsContinuousExport -ResourceGroupName "Dynamics365andAzure" -Name "Dynamics365-Telemetry" -ExportId $exportId.ExportId -PassThru

}Else{



}


