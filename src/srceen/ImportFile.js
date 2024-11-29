import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system';

export default function ImportFile(navigation) {
  const [fileName, setFileName] = useState('');
  const [emissionsData, setEmissionsData] = useState([]);

  const handleFilePicker = async () => {
    try {
      console.log("File Picker Triggered");
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (!file) {
            alert("No file selected. Please select a valid file.");
            return;
          }
          setFileName(file.name);

          const reader = new FileReader();
          reader.onload = async (e) => {
            const binaryStr = e.target.result;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(binaryStr);

            if (workbook.worksheets.length === 0) {
              alert("No worksheets found in the file.");
              return;
            }

            const worksheet = workbook.worksheets[0];
            const data = extractTableData(worksheet);
            setEmissionsData(data);
          };

          reader.readAsArrayBuffer(file);
        };

        input.click();
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        if (result.type === 'cancel') {
          alert("File selection canceled.");
          return;
        }

        console.log("Selected File:", result.name);
        setFileName(result.name);

        const fileContent = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const buffer = new Uint8Array(
          atob(fileContent)
            .split('')
            .map((char) => char.charCodeAt(0))
        );

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        if (workbook.worksheets.length === 0) {
          alert("No worksheets found in the file.");
          return;
        }

        const worksheet = workbook.worksheets[0];
        const data = extractTableData(worksheet);
        setEmissionsData(data);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const extractTableData = (worksheet) => {
    const data = [];
    worksheet.eachRow((row) => {
      const rowData = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        let cellValue = cell.value;
        if (cellValue && typeof cellValue === 'object') {
          cellValue = cellValue.result || ''; // ใช้ผลลัพธ์ถ้ามีสูตร
        }
        rowData.push(cellValue || '');
      });
      data.push(rowData);
    });
    return data;
  };

  const handleSubmit = () => {
    console.log("Data to submit:", emissionsData);
    alert("Data submitted successfully!");
    navigation.navigate('Graph', { emissionsData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import File</Text>

      <View style={styles.filePickerContainer}>
        <TextInput
          style={styles.fileInput}
          placeholder="No file selected"
          value={fileName}
          editable={false}
        />
        <TouchableOpacity style={styles.selectButton} onPress={handleFilePicker}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </View>

      {emissionsData.length > 0 ? (
        <ScrollView horizontal>
          <View>
            {emissionsData.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((cell, cellIndex) => (
                  <Text key={cellIndex} style={styles.tableCell}>
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>No data to display</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  fileInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#f9f9f9',
  },
  selectButton: {
    backgroundColor: '#3ACF58',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    minWidth: 80,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#0056A8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
