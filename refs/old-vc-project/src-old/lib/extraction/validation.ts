/**
 * Cross-Validation and Confidence Scoring
 * Validates extraction results between text and image sources
 * and calculates comprehensive quality metrics.
 */

import type {
  TextExtractionResult,
  ImageExtractionResult,
  ValidationResult,
} from "./types/extraction";

export interface CrossValidationOptions {
  tolerance: number;
  minConfidence: number;
  enableOwnershipValidation: boolean;
  enableCompanyValidation: boolean;
  enableSectorValidation: boolean;
}

/**
 * Cross-validate results between text and image sources
 */
export async function crossValidateResults(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult,
  options?: Partial<CrossValidationOptions>
): Promise<ValidationResult[]> {
  const defaultOptions: CrossValidationOptions = {
    tolerance: 0.1,
    minConfidence: 0.7,
    enableOwnershipValidation: true,
    enableCompanyValidation: true,
    enableSectorValidation: true,
    ...options,
  };

  const validations: ValidationResult[] = [];

  // Validate ownership percentages
  if (defaultOptions.enableOwnershipValidation) {
    const ownershipValidations = validateOwnershipCrossReference(
      textResult,
      imageResult,
      defaultOptions
    );
    validations.push(...ownershipValidations);
  }

  // Validate company names and data
  if (defaultOptions.enableCompanyValidation) {
    const companyValidations = validateCompanyCrossReference(
      textResult,
      imageResult,
      defaultOptions
    );
    validations.push(...companyValidations);
  }

  // Validate sector information
  if (defaultOptions.enableSectorValidation) {
    const sectorValidations = validateSectorCrossReference(
      textResult,
      imageResult,
      defaultOptions
    );
    validations.push(...sectorValidations);
  }

  return validations;
}

/**
 * Validate ownership percentages between text and image sources
 */
function validateOwnershipCrossReference(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult,
  options: CrossValidationOptions
): ValidationResult[] {
  const validations: ValidationResult[] = [];

  // Extract ownership data from both sources
  const textOwnership = extractOwnershipFromText(textResult);
  const imageOwnership = extractOwnershipFromImages(imageResult);

  // Cross-validate matching entries
  for (const textOwn of textOwnership) {
    for (const imageOwn of imageOwnership) {
      if (areOwnershipEntriesSimilar(textOwn, imageOwn, options.tolerance)) {
        validations.push({
          field: "ownership",
          textValue: textOwn,
          imageValue: imageOwn,
          finalValue: selectBestOwnershipValue(
            textOwn,
            imageOwn,
            options.minConfidence
          ),
          confidence: "high",
          validationMethod: "cross-reference",
          reasoning:
            "Ownership percentage found in both text and chart/table sources",
          conflicts: [],
        });
      }
    }
  }

  return validations;
}

/**
 * Validate company data between text and image sources
 */
function validateCompanyCrossReference(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult,
  _options: CrossValidationOptions
): ValidationResult[] {
  const validations: ValidationResult[] = [];

  const textCompanies = extractCompanyDataFromText(textResult);
  const imageCompanies = extractCompanyDataFromImages(imageResult);

  // Cross-validate company names and associated data
  for (const textCompany of textCompanies) {
    for (const imageCompany of imageCompanies) {
      if (areCompanyEntriesSimilar(textCompany, imageCompany)) {
        validations.push({
          field: "company",
          textValue: textCompany,
          imageValue: imageCompany,
          finalValue: mergeCompanyData(textCompany, imageCompany),
          confidence: "medium",
          validationMethod: "cross-reference",
          reasoning: "Company information found in both text and image sources",
          conflicts: [],
        });
      }
    }
  }

  return validations;
}

/**
 * Validate sector information between text and image sources
 */
function validateSectorCrossReference(
  textResult: TextExtractionResult,
  imageResult: ImageExtractionResult,
  _options: CrossValidationOptions
): ValidationResult[] {
  const validations: ValidationResult[] = [];

  const textSectors = extractSectorsFromText(textResult);
  const imageSectors = extractSectorsFromImages(imageResult);

  // Cross-validate sector information
  for (const textSector of textSectors) {
    for (const imageSector of imageSectors) {
      if (areSectorEntriesSimilar(textSector, imageSector)) {
        validations.push({
          field: "sector",
          textValue: textSector,
          imageValue: imageSector,
          finalValue: mergeSectorData(textSector, imageSector),
          confidence: "medium",
          validationMethod: "cross-reference",
          reasoning:
            "Sector information validated between text and image sources",
          conflicts: [],
        });
      }
    }
  }

  return validations;
}

/**
 * Extract ownership data from text
 */
function extractOwnershipFromText(
  textResult: TextExtractionResult
): Record<string, unknown>[] {
  const ownershipEntries: Record<string, unknown>[] = [];

  const fullText =
    textResult.content + " " + textResult.pages.map((p) => p.content).join(" ");

  const ownershipPatterns = [
    /(\d+(?:\.\d+)?)\s*%/g,
    /ownership[:\s]+(\d+(?:\.\d+)?)\s*%/gi,
    /(\d+(?:\.\d+)?)\s*percent/gi,
    /shares?\s*[:\s]*(\d+(?:\.\d+)?)\s*%/gi,
  ];

  for (const pattern of ownershipPatterns) {
    let match;
    while ((match = pattern.exec(fullText)) !== null) {
      const percentage = parseFloat(match[1]);
      if (percentage >= 0 && percentage <= 100) {
        ownershipEntries.push({
          value: percentage,
          source: "text",
          context: match[0],
          position: match.index,
        });
      }
    }
  }

  return ownershipEntries;
}

/**
 * Extract ownership data from images
 */
function extractOwnershipFromImages(
  imageResult: ImageExtractionResult
): Record<string, unknown>[] {
  const ownershipEntries: Record<string, unknown>[] = [];

  // Extract from charts
  for (const chart of imageResult.charts) {
    if (chart.data && Array.isArray(chart.data)) {
      for (const dataPoint of chart.data) {
        if (
          dataPoint.y !== undefined &&
          dataPoint.y >= 0 &&
          dataPoint.y <= 100
        ) {
          ownershipEntries.push({
            value: dataPoint.y,
            source: "chart",
            chartType: chart.type,
            label: dataPoint.label || dataPoint.category,
            confidence: chart.confidence,
          });
        }
      }
    }
  }

  // Extract from tables
  for (const table of imageResult.tables) {
    if (table.rows && Array.isArray(table.rows)) {
      for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
        const row = table.rows[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const cellValue = row[colIndex];
          if (
            typeof cellValue === "number" &&
            cellValue >= 0 &&
            cellValue <= 100
          ) {
            ownershipEntries.push({
              value: cellValue,
              source: "table",
              row: rowIndex,
              column: colIndex,
              header: table.headers?.[colIndex],
              confidence: table.confidence,
            });
          }
        }
      }
    }
  }

  return ownershipEntries;
}

/**
 * Check if ownership entries are similar
 */
function areOwnershipEntriesSimilar(
  textOwn: Record<string, unknown>,
  imageOwn: Record<string, unknown>,
  tolerance: number
): boolean {
  if (!textOwn || !imageOwn) return false;

  const diff = Math.abs((textOwn.value as number) - (imageOwn.value as number));
  return diff <= tolerance;
}

/**
 * Select the best ownership value between text and image sources
 */
function selectBestOwnershipValue(
  textOwn: Record<string, unknown>,
  imageOwn: Record<string, unknown>,
  minConfidence: number
): Record<string, unknown> {
  if (!textOwn) return imageOwn;
  if (!imageOwn) return textOwn;

  // Prefer image data if confidence is high, otherwise prefer text
  if ((imageOwn.confidence as number) >= minConfidence) {
    return imageOwn;
  }

  return textOwn;
}

/**
 * Extract company data from text
 */
function extractCompanyDataFromText(
  textResult: TextExtractionResult
): Record<string, unknown>[] {
  const companies: Record<string, unknown>[] = [];

  const fullText =
    textResult.content + " " + textResult.pages.map((p) => p.content).join(" ");

  const companyPatterns = [
    /([A-Z][a-zA-Z\s&\.,-]+(?:Inc\.|LLC|GmbH|Corp\.|Ltd\.|AG|BV|NV|SA|AB|S\.p\.A\.|K\.K\.|Co\.|LP|LLP|Ltd|PLC|Pty|Corp|Inc|LLC|Ltd|Limited|Corporation|Incorporated|Company|Partnership|Holdings|Beteiligungs|Investments|Capital|Ventures|Holdings|Biotech|Therapeutics|Pharmaceuticals|Healthcare|Technology|Software|Systems|Solutions|Services|Networks|Platforms|Labs|Institute|Foundation|Trust|Fund|Partners|Associates|Group|Enterprise|Corporation|International|Global|Worldwide|Europe|America|Asia|Pacific|Atlantic|Northern|Southern|Eastern|Western|Central|North|South|East|West|Medical|Clinical|Research|Development|Innovation|Advanced|Next|Future|Smart|Intelligent|Digital|Cloud|Mobile|Web|Online|Virtual|Real|Physical|Hybrid|Integrated|Connected|Secure|Safe|Protected|Private|Public|Open|Closed|Free|Paid|Premium|Professional|Enterprise|Business|Commercial|Industrial|Manufacturing|Production|Distribution|Logistics|Supply|Chain|Retail|Wholesale|Consumer|Customer|Client|User|Patient|Doctor|Hospital|Clinic|Pharmacy|Laboratory|University|School|College|Institute|Center|Hub|Space|Place|Point|Spot|Location|Site|Venue|Area|Region|Zone|District|Neighborhood|Community|Village|Town|City|State|Province|Country|Nation|Continent|World|Global|International|Domestic|Local|Regional|National|Continental|Worldwide|Universal|Comprehensive|Complete|Full|Total|Entire|Whole|All|Every|Each|Individual|Single|Unique|Special|Particular|Specific|Certain|Some|Any|All|None|Zero|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Last|Final|Initial|Original|Primary|Secondary|Tertiary|Main|Major|Minor|Key|Important|Critical|Essential|Fundamental|Vital|Crucial|Significant|Meaningful|Substantial|Considerable|Notable|Remarkable|Outstanding|Exceptional|Extraordinary|Amazing|Incredible|Fantastic|Wonderful|Great|Good|Better|Best|Excellent|Superior|Premium|High|Low|Medium|Average|Normal|Standard|Regular|Typical|Common|Usual|Ordinary|Regular|Basic|Simple|Complex|Advanced|Sophisticated|Professional|Expert|Specialist|General|Universal|Specific|Particular|Individual|Personal|Private|Public|Open|Closed|Available|Accessible|Reachable|Obtainable|Gettable|Findable|Searchable|Discoverable|Locatable|Trackable|Traceable|Followable|Monitorable|Watchable|Observable|Viewable|Seeable|Visible|Apparent|Obvious|Clear|Transparent|Opaque|Solid|Liquid|Gas|Plasma|Energy|Power|Force|Strength|Intensity|Level|Degree|Amount|Quantity|Volume|Size|Scale|Scope|Range|Extent|Reach|Span|Width|Length|Height|Depth|Distance|Proximity|Nearness|Closeness|Vicinity|Area|Region|Zone|Sector|Field|Domain|Realm|Kingdom|Empire|Territory|Land|Ground|Earth|Planet|World|Universe|Cosmos|Galaxy|Solar|System|Star|Sun|Moon|Planet|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Mercury|Venus))\s+(?:investment|funding|round|series|stage|valuation|amount|date|sector|industry|ownership)/gi,
    /([A-Z][a-zA-Z\s&\.,-]+(?:Inc\.|LLC|GmbH|Corp\.|Ltd\.|AG|BV|NV|SA|AB|S\.p\.A\.|K\.K\.|Co\.|LP|LLP|Ltd|PLC|Pty|Corp|Inc|LLC|Ltd|Limited|Corporation|Incorporated|Company|Partnership|Holdings|Beteiligungs|Investments|Capital|Ventures|Holdings|Biotech|Therapeutics|Pharmaceuticals|Healthcare|Technology|Software|Systems|Solutions|Services|Networks|Platforms|Labs|Institute|Foundation|Trust|Fund|Partners|Associates|Group|Enterprise|Corporation|International|Global|Worldwide|Europe|America|Asia|Pacific|Atlantic|Northern|Southern|Eastern|Western|Central|North|South|East|West|Medical|Clinical|Research|Development|Innovation|Advanced|Next|Future|Smart|Intelligent|Digital|Cloud|Mobile|Web|Online|Virtual|Real|Physical|Hybrid|Integrated|Connected|Secure|Safe|Protected|Private|Public|Open|Closed|Free|Paid|Premium|Professional|Enterprise|Business|Commercial|Industrial|Manufacturing|Production|Distribution|Logistics|Supply|Chain|Retail|Wholesale|Consumer|Customer|Client|User|Patient|Doctor|Hospital|Clinic|Pharmacy|Laboratory|University|School|College|Institute|Center|Hub|Space|Place|Point|Spot|Location|Site|Venue|Area|Region|Zone|District|Neighborhood|Community|Village|Town|City|State|Province|Country|Nation|Continent|World|Global|International|Domestic|Local|Regional|National|Continental|Worldwide|Universal|Comprehensive|Complete|Full|Total|Entire|Whole|All|Every|Each|Individual|Single|Unique|Special|Particular|Specific|Certain|Some|Any|All|None|Zero|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Last|Final|Initial|Original|Primary|Secondary|Tertiary|Main|Major|Minor|Key|Important|Critical|Essential|Fundamental|Vital|Crucial|Significant|Meaningful|Substantial|Considerable|Notable|Remarkable|Outstanding|Exceptional|Extraordinary|Amazing|Incredible|Fantastic|Wonderful|Great|Good|Better|Best|Excellent|Superior|Premium|High|Low|Medium|Average|Normal|Standard|Regular|Typical|Common|Usual|Ordinary|Regular|Basic|Simple|Complex|Advanced|Sophisticated|Professional|Expert|Specialist|General|Universal|Specific|Particular|Individual|Personal|Private|Public|Open|Closed|Available|Accessible|Reachable|Obtainable|Gettable|Findable|Searchable|Discoverable|Locatable|Trackable|Traceable|Followable|Monitorable|Watchable|Observable|Viewable|Seeable|Visible|Apparent|Obvious|Clear|Transparent|Opaque|Solid|Liquid|Gas|Plasma|Energy|Power|Force|Strength|Intensity|Level|Degree|Amount|Quantity|Volume|Size|Scale|Scope|Range|Extent|Reach|Span|Width|Length|Height|Depth|Distance|Proximity|Nearness|Closeness|Vicinity|Area|Region|Zone|Sector|Field|Domain|Realm|Kingdom|Empire|Territory|Land|Ground|Earth|Planet|World|Universe|Cosmos|Galaxy|Solar|System|Star|Sun|Moon|Planet|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Mercury|Venus))/g,
  ];

  for (const pattern of companyPatterns) {
    let match;
    while ((match = pattern.exec(fullText)) !== null) {
      const companyName = match[1]?.trim();
      if (companyName && companyName.length > 2 && companyName.length < 100) {
        companies.push({
          name: companyName,
          source: "text",
          context: match[0],
          position: match.index,
        });
      }
    }
  }

  return companies;
}

/**
 * Extract company data from images
 */
function extractCompanyDataFromImages(
  imageResult: ImageExtractionResult
): Record<string, unknown>[] {
  const companies: Record<string, unknown>[] = [];

  for (const textBlock of imageResult.textBlocks) {
    if (textBlock.content && textBlock.content.length > 2) {
      const companyPattern =
        /([A-Z][a-zA-Z\s&\.,-]+(?:Inc\.|LLC|GmbH|Corp\.|Ltd\.|AG|BV|NV|SA|AB|S\.p\.A\.|K\.K\.|Co\.|LP|LLP|Ltd|PLC|Pty|Corp|Inc|LLC|Ltd|Limited|Corporation|Incorporated|Company))/g;
      let match;
      while ((match = companyPattern.exec(textBlock.content)) !== null) {
        const companyName = match[1]?.trim();
        if (companyName && companyName.length > 2 && companyName.length < 100) {
          companies.push({
            name: companyName,
            source: "image_text",
            confidence: textBlock.confidence,
            coordinates: textBlock.coordinates,
          });
        }
      }
    }
  }

  return companies;
}

/**
 * Check if company entries are similar
 */
function areCompanyEntriesSimilar(
  textCompany: Record<string, unknown>,
  imageCompany: Record<string, unknown>
): boolean {
  const textName = (textCompany.name as string)?.toLowerCase();
  const imageName = (imageCompany.name as string)?.toLowerCase();

  if (!textName || !imageName) return false;

  // Check for exact match or significant overlap
  return (
    textName === imageName ||
    textName.includes(imageName) ||
    imageName.includes(textName) ||
    this.calculateNameSimilarity(textName, imageName) > 0.8
  );
}

/**
 * Merge company data from text and image sources
 */
function mergeCompanyData(
  textCompany: Record<string, unknown>,
  imageCompany: Record<string, unknown>
): Record<string, unknown> {
  return {
    name: textCompany.name || imageCompany.name,
    source: "cross-validated",
    textSource: textCompany,
    imageSource: imageCompany,
  };
}

/**
 * Extract sectors from text
 */
function extractSectorsFromText(
  textResult: TextExtractionResult
): Record<string, unknown>[] {
  const sectors: Record<string, unknown>[] = [];

  const fullText =
    textResult.content + " " + textResult.pages.map((p) => p.content).join(" ");

  const sectorPatterns = [
    /([A-Z][a-z\s&]+)[:\s]*(\d+)\s*(?:companies|investments)/gi,
    /sector[:\s]+([A-Z][a-z\s&]+)[:\s]*(\d+)\s*(?:companies|investments)/gi,
  ];

  for (const pattern of sectorPatterns) {
    let match;
    while ((match = pattern.exec(fullText)) !== null) {
      const sectorName = match[1]?.trim();
      const count = parseInt(match[2]);

      if (sectorName && count > 0) {
        sectors.push({
          sector: sectorName,
          count,
          source: "text",
        });
      }
    }
  }

  return sectors;
}

/**
 * Extract sectors from images
 */
function extractSectorsFromImages(
  imageResult: ImageExtractionResult
): Record<string, unknown>[] {
  const sectors: Record<string, unknown>[] = [];

  // Extract sector information from charts and tables
  for (const chart of imageResult.charts) {
    if (chart.data && chart.data.length > 0) {
      for (const dataPoint of chart.data) {
        if (dataPoint.category) {
          sectors.push({
            sector: dataPoint.category,
            count: dataPoint.y || 1,
            source: "chart",
            chartType: chart.type,
          });
        }
      }
    }
  }

  return sectors;
}

/**
 * Check if sector entries are similar
 */
function areSectorEntriesSimilar(
  textSector: Record<string, unknown>,
  imageSector: Record<string, unknown>
): boolean {
  const textName = (textSector.sector as string)?.toLowerCase();
  const imageName = (imageSector.sector as string)?.toLowerCase();

  if (!textName || !imageName) return false;

  return (
    textName === imageName ||
    textName.includes(imageName) ||
    imageName.includes(textName)
  );
}

/**
 * Merge sector data from text and image sources
 */
function mergeSectorData(
  textSector: Record<string, unknown>,
  imageSector: Record<string, unknown>
): Record<string, unknown> {
  return {
    sector: textSector.sector || imageSector.sector,
    count: Math.max(
      (textSector.count as number) || 0,
      (imageSector.count as number) || 0
    ),
    source: "cross-validated",
    textSource: textSector,
    imageSource: imageSector,
  };
}

/**
 * Calculate name similarity (simple implementation)
 */
function _calculateNameSimilarity(name1: string, name2: string): number {
  const words1 = name1.split(" ");
  const words2 = name2.split(" ");

  const commonWords = words1.filter((word) =>
    words2.some((w2) => w2.includes(word) || word.includes(w2))
  );
  const totalWords = Math.max(words1.length, words2.length);

  return commonWords.length / totalWords;
}
