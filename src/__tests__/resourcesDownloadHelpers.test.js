import fs from 'fs-extra';
import path from 'path-extra';
import ospath from 'ospath';
import { readHelpsFolder } from './folderUtils'
import { ALL_BIBLE_BOOKS } from '../common/BooksOfTheBible'
// helpers
const {
  default: SourceContentUpdater,
  apiHelpers,
  resourcesDownloadHelpers,
} = require('tc-source-content-updater');


// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Tests for resourcesDownloadHelpers.downloadAndProcessResource()', () => {
  const resourcesPath = path.join(ospath.home(), 'translationCore/temp');

  it('Test getLatestResources', () => {
    const sourceContentUpdater = new SourceContentUpdater();
    sourceContentUpdater.getLatestResources([], resourcesPath).then( () => {
      const neededResources = sourceContentUpdater.updatedCatalogResources;
      console.log(neededResources)
      for (const item of neededResources) {
        const lang = item.languageId
        if (lang === 'en') {
          console.log(item)
        }
      }
    });
  })

  it('Test resourcesDownloadHelpers.downloadAndProcessResource() for EN TN', () => {
    const resource = {
      "languageId": "en",
      "resourceId": "tn",
      "remoteModifiedTime": "2024-04-24T05:55:45Z",
      "downloadUrl": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
      "version": "80",
      "subject": "TSV_Translation_Notes",
      "owner": "unfoldingWord",
      catalogEntry: {
        subject: {},
        resource: {},
        format: {},
      },
    };
    return resourcesDownloadHelpers.downloadAndProcessResource(resource, resourcesPath, []).then((res) => {
      const folderPath = path.join(resourcesPath, '/en/translationHelps/translationNotes/v80_unfoldingWord')
      const bookIds = Object.keys(ALL_BIBLE_BOOKS)
      const outputFolder = path.join(resourcesPath, 'processed', resource.languageId, resource.resourceId)
      fs.ensureDirSync(outputFolder);
      for (const bookId of bookIds) {
        const contents = readHelpsFolder(folderPath, bookId)
        const outputPath = path.join(outputFolder, `${resource.languageId}_${resource.resourceId}_${bookId}.json`)
        fs.outputJsonSync(outputPath, contents, { spaces: 2 });
      }
      expect(resourceData).toEqual(resource);
    });
  });

  it('Test resourcesDownloadHelpers.downloadAndProcessResource() for EN TW', () => {
    const resource = {
      "languageId": "en",
      "resourceId": "tw",
      "remoteModifiedTime": "2024-04-24T05:55:28Z",
      "downloadUrl": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
      "version": "80",
      "subject": "Translation_Words",
      "owner": "unfoldingWord",
      catalogEntry: {
        subject: {},
        resource: {},
        format: {},
      },
    };
    return resourcesDownloadHelpers.downloadAndProcessResource(resource, resourcesPath, []).then((res) => {
      const folderPath = path.join(resourcesPath, '/en/translationHelps/translationWords/v80_unfoldingWord')
      const bookIds = Object.keys(ALL_BIBLE_BOOKS)
      const outputFolder = path.join(resourcesPath, 'processed', resource.languageId, resource.resourceId)
      fs.ensureDirSync(outputFolder);
      for (const bookId of bookIds) {
        const contents = readHelpsFolder(folderPath, bookId)
        const outputPath = path.join(outputFolder, `${resource.languageId}_${resource.resourceId}_${bookId}.json`)
        fs.outputJsonSync(outputPath, contents, { spaces: 2 });
      }
      expect(resourceData).toEqual(resource);
    });
  });

  it('Test resourcesDownloadHelpers.downloadAndProcessResource() for CEB ULB', () => {
    const resource = {
      languageId: 'ceb',
      resourceId: 'ulb',
      remoteModifiedTime: '0001-01-01T00:00:00+00:00',
      downloadUrl: 'https://cdn.door43.org/ceb/ulb/v4.2/ulb.zip',
      version: '4.2',
      subject: 'Bible',
      catalogEntry: {
        subject: {},
        resource: {},
        format: {},
      },
    };
    return resourcesDownloadHelpers.downloadAndProcessResource(resource, resourcesPath, []).then((res) => {
      expect(res).toEqual(resource);
    });
  });

  it('Test resourcesDownloadHelpers.downloadAndProcessResource() for el-x-koine UGNT', () => {
    const resource = {
      languageId: 'el-x-koine',
      resourceId: 'ugnt',
      remoteModifiedTime: '0001-01-01T00:00:00+00:00',
      downloadUrl: 'https://cdn.door43.org/el-x-koine/ugnt/v0.2/ugnt.zip',
      version: '0.2',
      subject: 'Bible',
      catalogEntry: {
        subject: {},
        resource: {},
        format: {},
      },
    };
    return resourcesDownloadHelpers.downloadAndProcessResource(resource, resourcesPath, []).then((res) => {
      expect(res).toEqual(resource);
    });
  });
});

//
// helpers
//

const en_tn = {
  "languageId": "en",
  "resourceId": "tn",
  "remoteModifiedTime": "2024-04-24T05:55:45Z",
  "downloadUrl": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
  "version": "80",
  "subject": "TSV_Translation_Notes",
  "owner": "unfoldingWord",
  "catalogEntry": {
    "subject": "TSV_Translation_Notes",
    "resource": {
      "id": 42720,
      "url": "https://git.door43.org/api/v1/catalog/entry/unfoldingWord/en_tn/v80",
      "name": "en_tn",
      "owner": "unfoldingWord",
      "full_name": "unfoldingWord/en_tn",
      "repo": {
        "id": 3942,
        "owner": {
          "id": 613,
          "login": "unfoldingWord",
          "login_name": "",
          "full_name": "unfoldingWord®",
          "email": "unfoldingword@noreply.door43.org",
          "avatar_url": "https://git.door43.org/avatars/1bc81b740b4286613cdaa55ddfe4b1fc",
          "language": "",
          "is_admin": false,
          "last_login": "0001-01-01T00:00:00Z",
          "created": "2016-02-16T23:44:26Z",
          "repo_languages": [
            "el-x-koine",
            "en",
            "fr",
            "hbo"
          ],
          "repo_subjects": [
            "Aligned Bible",
            "Aramaic Grammar",
            "Bible",
            "Greek Grammar",
            "Greek Lexicon",
            "Greek New Testament",
            "Hebrew Grammar",
            "Hebrew Old Testament",
            "OBS Study Questions",
            "OBS Translation Notes",
            "OBS Translation Questions",
            "Open Bible Stories",
            "Study Notes",
            "Training Library",
            "Translation Academy",
            "Translation Words",
            "TSV OBS Study Notes",
            "TSV OBS Study Questions",
            "TSV OBS Translation Notes",
            "TSV OBS Translation Questions",
            "TSV OBS Translation Words Links",
            "TSV Study Notes",
            "TSV Study Questions",
            "TSV Translation Notes",
            "TSV Translation Questions",
            "TSV Translation Words Links"
          ],
          "repo_metadata_types": [
            "rc"
          ],
          "restricted": false,
          "active": false,
          "prohibit_login": false,
          "location": "",
          "website": "https://unfoldingword.org",
          "description": "",
          "visibility": "public",
          "followers_count": 0,
          "following_count": 0,
          "starred_repos_count": 0,
          "username": "unfoldingWord"
        },
        "name": "en_tn",
        "full_name": "unfoldingWord/en_tn",
        "description": "unfoldingWord® Translation Notes",
        "empty": false,
        "private": false,
        "fork": false,
        "template": false,
        "parent": null,
        "mirror": false,
        "size": 749526,
        "languages_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/languages",
        "html_url": "https://git.door43.org/unfoldingWord/en_tn",
        "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn",
        "link": "",
        "ssh_url": "git@git.door43.org:unfoldingWord/en_tn.git",
        "clone_url": "https://git.door43.org/unfoldingWord/en_tn.git",
        "original_url": "",
        "website": "https://www.unfoldingword.org/utn/",
        "stars_count": 7,
        "forks_count": 15,
        "watchers_count": 1,
        "open_issues_count": 67,
        "open_pr_counter": 4,
        "release_counter": 76,
        "default_branch": "master",
        "archived": false,
        "created_at": "2016-09-20T19:44:28Z",
        "updated_at": "2024-06-07T15:53:40Z",
        "archived_at": "1970-01-01T00:00:00Z",
        "permissions": {
          "admin": false,
          "push": false,
          "pull": true
        },
        "has_issues": true,
        "internal_tracker": {
          "enable_time_tracker": true,
          "allow_only_contributors_to_track_time": true,
          "enable_issue_dependencies": true
        },
        "has_wiki": false,
        "has_pull_requests": true,
        "has_projects": true,
        "has_releases": true,
        "has_packages": false,
        "has_actions": false,
        "ignore_whitespace_conflicts": true,
        "allow_merge_commits": true,
        "allow_rebase": false,
        "allow_rebase_explicit": false,
        "allow_squash_merge": true,
        "allow_rebase_update": true,
        "default_delete_branch_after_merge": false,
        "default_merge_style": "squash",
        "default_allow_maintainer_edit": false,
        "avatar_url": "https://git.door43.org/repo-avatars/3942-740ad9c357ad86fe1afe53fa0f6ed32f",
        "internal": false,
        "mirror_interval": "",
        "mirror_updated": "0001-01-01T00:00:00Z",
        "repo_transfer": null,
        "metadata_type": "rc",
        "metadata_version": "0.2",
        "language": "en",
        "language_title": "English",
        "language_direction": "ltr",
        "language_is_gl": true,
        "subject": "TSV Translation Notes",
        "flavor_type": "parascriptural",
        "flavor": "x-TranslationNotes",
        "abbreviation": "tn",
        "title": "unfoldingWord® Translation Notes",
        "ingredients": [
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "gen",
            "path": "tn_GEN.tsv",
            "sort": 1,
            "title": "Genesis",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "exo",
            "path": "tn_EXO.tsv",
            "sort": 2,
            "title": "Exodus",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "lev",
            "path": "tn_LEV.tsv",
            "sort": 3,
            "title": "Leviticus",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "num",
            "path": "tn_NUM.tsv",
            "sort": 4,
            "title": "Numbers",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "deu",
            "path": "tn_DEU.tsv",
            "sort": 5,
            "title": "Deuteronomy",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "jos",
            "path": "tn_JOS.tsv",
            "sort": 6,
            "title": "Joshua",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "jdg",
            "path": "tn_JDG.tsv",
            "sort": 7,
            "title": "Judges",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "rut",
            "path": "tn_RUT.tsv",
            "sort": 8,
            "title": "Ruth",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "1sa",
            "path": "tn_1SA.tsv",
            "sort": 9,
            "title": "1 Samuel",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "2sa",
            "path": "tn_2SA.tsv",
            "sort": 10,
            "title": "2 Samuel",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "1ki",
            "path": "tn_1KI.tsv",
            "sort": 11,
            "title": "1 Kings",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "2ki",
            "path": "tn_2KI.tsv",
            "sort": 12,
            "title": "2 Kings",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "1ch",
            "path": "tn_1CH.tsv",
            "sort": 13,
            "title": "1 Chronicles",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "2ch",
            "path": "tn_2CH.tsv",
            "sort": 14,
            "title": "2 Chronicles",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "ezr",
            "path": "tn_EZR.tsv",
            "sort": 15,
            "title": "Ezra",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "neh",
            "path": "tn_NEH.tsv",
            "sort": 16,
            "title": "Nehemiah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "est",
            "path": "tn_EST.tsv",
            "sort": 17,
            "title": "Esther",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "job",
            "path": "tn_JOB.tsv",
            "sort": 18,
            "title": "Job",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "psa",
            "path": "tn_PSA.tsv",
            "sort": 19,
            "title": "Psalms",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "pro",
            "path": "tn_PRO.tsv",
            "sort": 20,
            "title": "Proverbs",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "ecc",
            "path": "tn_ECC.tsv",
            "sort": 21,
            "title": "Ecclesiastes",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "sng",
            "path": "tn_SNG.tsv",
            "sort": 22,
            "title": "Song of Solomon",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "isa",
            "path": "tn_ISA.tsv",
            "sort": 23,
            "title": "Isaiah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "jer",
            "path": "tn_JER.tsv",
            "sort": 24,
            "title": "Jeremiah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "lam",
            "path": "tn_LAM.tsv",
            "sort": 25,
            "title": "Lamentations",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "ezk",
            "path": "tn_EZK.tsv",
            "sort": 26,
            "title": "Ezekiel",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "dan",
            "path": "tn_DAN.tsv",
            "sort": 27,
            "title": "Daniel",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "hos",
            "path": "tn_HOS.tsv",
            "sort": 28,
            "title": "Hosea",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "jol",
            "path": "tn_JOL.tsv",
            "sort": 29,
            "title": "Joel",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "amo",
            "path": "tn_AMO.tsv",
            "sort": 30,
            "title": "Amos",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "oba",
            "path": "tn_OBA.tsv",
            "sort": 31,
            "title": "Obadiah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "jon",
            "path": "tn_JON.tsv",
            "sort": 32,
            "title": "Jonah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "mic",
            "path": "tn_MIC.tsv",
            "sort": 33,
            "title": "Micah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "nam",
            "path": "tn_NAM.tsv",
            "sort": 34,
            "title": "Nahum",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "hab",
            "path": "tn_HAB.tsv",
            "sort": 35,
            "title": "Habakkuk",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "zep",
            "path": "tn_ZEP.tsv",
            "sort": 36,
            "title": "Zephaniah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "hag",
            "path": "tn_HAG.tsv",
            "sort": 37,
            "title": "Haggai",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "zec",
            "path": "tn_ZEC.tsv",
            "sort": 38,
            "title": "Zechariah",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-ot"
            ],
            "identifier": "mal",
            "path": "tn_MAL.tsv",
            "sort": 39,
            "title": "Malachi",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "mat",
            "path": "tn_MAT.tsv",
            "sort": 41,
            "title": "Matthew",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "mrk",
            "path": "tn_MRK.tsv",
            "sort": 42,
            "title": "Mark",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "luk",
            "path": "tn_LUK.tsv",
            "sort": 43,
            "title": "Luke",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "jhn",
            "path": "tn_JHN.tsv",
            "sort": 44,
            "title": "John",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "act",
            "path": "tn_ACT.tsv",
            "sort": 45,
            "title": "Acts",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "rom",
            "path": "tn_ROM.tsv",
            "sort": 46,
            "title": "Romans",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "1co",
            "path": "tn_1CO.tsv",
            "sort": 47,
            "title": "1 Corinthians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "2co",
            "path": "tn_2CO.tsv",
            "sort": 48,
            "title": "2 Corinthians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "gal",
            "path": "tn_GAL.tsv",
            "sort": 49,
            "title": "Galatians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "eph",
            "path": "tn_EPH.tsv",
            "sort": 50,
            "title": "Ephesians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "php",
            "path": "tn_PHP.tsv",
            "sort": 51,
            "title": "Philippians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "col",
            "path": "tn_COL.tsv",
            "sort": 52,
            "title": "Colossians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "1th",
            "path": "tn_1TH.tsv",
            "sort": 53,
            "title": "1 Thessalonians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "2th",
            "path": "tn_2TH.tsv",
            "sort": 54,
            "title": "2 Thessalonians",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "1ti",
            "path": "tn_1TI.tsv",
            "sort": 55,
            "title": "1 Timothy",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "2ti",
            "path": "tn_2TI.tsv",
            "sort": 56,
            "title": "2 Timothy",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "tit",
            "path": "tn_TIT.tsv",
            "sort": 57,
            "title": "Titus",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "phm",
            "path": "tn_PHM.tsv",
            "sort": 58,
            "title": "Philemon",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "heb",
            "path": "tn_HEB.tsv",
            "sort": 59,
            "title": "Hebrews",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "jas",
            "path": "tn_JAS.tsv",
            "sort": 60,
            "title": "James",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "1pe",
            "path": "tn_1PE.tsv",
            "sort": 61,
            "title": "1 Peter",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "2pe",
            "path": "tn_2PE.tsv",
            "sort": 62,
            "title": "2 Peter",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "1jn",
            "path": "tn_1JN.tsv",
            "sort": 63,
            "title": "1 John",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "2jn",
            "path": "tn_2JN.tsv",
            "sort": 64,
            "title": "2 John",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "3jn",
            "path": "tn_3JN.tsv",
            "sort": 65,
            "title": "3 John",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "jud",
            "path": "tn_JUD.tsv",
            "sort": 66,
            "title": "Jude",
            "versification": "ufw"
          },
          {
            "categories": [
              "bible-nt"
            ],
            "identifier": "rev",
            "path": "tn_REV.tsv",
            "sort": 67,
            "title": "Revelation",
            "versification": "ufw"
          }
        ],
        "checking_level": 3,
        "catalog": {
          "prod": {
            "branch_or_tag_name": "v80",
            "release_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/releases/10974006",
            "commit_sha": "19a3000c0ff6d8d8046c5ff5866e555636240e30",
            "released": "2024-04-24T05:55:45Z",
            "zipball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
            "tarball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.tar.gz",
            "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/git/trees/v80?recursive=1&per_page=99999",
            "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/contents?ref=v80"
          },
          "preprod": null,
          "latest": {
            "branch_or_tag_name": "master",
            "release_url": null,
            "commit_sha": "5489c770d971238acb935d2b4525613441b7b9d2",
            "released": "2024-05-03T16:52:04Z",
            "zipball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/5489c770d9.zip",
            "tarball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/5489c770d9.tar.gz",
            "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/git/trees/5489c770d9?recursive=1&per_page=99999",
            "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/contents?ref=5489c770d9"
          }
        },
        "content_format": "tsv9"
      },
      "release": {
        "id": 10974006,
        "tag_name": "v80",
        "target_commitish": "release_v80",
        "name": "Version 80",
        "body": "This version includes the book package of 3 John (3JN).\n\nConsistency Check\nThe following books have undergone a Book Package consistency check:\n\nGenesis (GEN)\nExodus (EXO)\nRuth (RUT)\nEzra (EZR)\nNehemiah (NEH)\nEsther (EST)\nJob (JOB)\nProverbs (PRO)\nSong of Songs (SOS)\nObadiah (OBA)\nJonah (JON)\nZephaniah(ZEP)\nHaggai (HAG)\nMatthew (MAT)\nMark (MRK)\nLuke (LUK)\nJohn (JHN)\nActs (ACT)\nRomans (ROM)\n1 Corinthians (1CO)\n2 Corinthians (2CO)\nGalatians (GAL)\nEphesians (EPH)\nPhilippians (PHP)\nColossians (COL)\n1 Thessalonians (1TH)\n2 Thessalonians (2TH)\n1 Timothy (1TI)\n2 Timothy (2TI)\nTitus (TIT)\nPhilemon (PHM)\nHebrews (HEB)\nJames (JAS)\n1 Peter (1PE)\n2 Peter (2PE)\n1 John (1JN)\n2 John (2JN)\n3 John (3JN)\nJude (JUD)\nRevelation (REV)",
        "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/releases/10974006",
        "html_url": "https://git.door43.org/unfoldingWord/en_tn/releases/tag/v80",
        "tarball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.tar.gz",
        "zipball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
        "upload_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/releases/10974006/assets",
        "draft": false,
        "prerelease": false,
        "created_at": "2024-04-24T05:55:45Z",
        "published_at": "2024-04-24T05:55:45Z",
        "author": {
          "id": 52596,
          "login": "Seema",
          "login_name": "",
          "full_name": "",
          "email": "seema@noreply.door43.org",
          "avatar_url": "https://secure.gravatar.com/avatar/0fe97aef1bc7759077f642f9360659be?d=identicon",
          "language": "",
          "is_admin": false,
          "last_login": "0001-01-01T00:00:00Z",
          "created": "2023-06-26T05:40:38Z",
          "repo_languages": [
            "en",
            "hi"
          ],
          "repo_subjects": [
            "Aligned Bible",
            "Open Bible Stories"
          ],
          "repo_metadata_types": [
            "sb",
            "tc"
          ],
          "restricted": false,
          "active": false,
          "prohibit_login": false,
          "location": "",
          "website": "",
          "description": "",
          "visibility": "public",
          "followers_count": 0,
          "following_count": 0,
          "starred_repos_count": 0,
          "username": "Seema"
        },
        "assets": [
          {
            "id": 10383,
            "name": "en_tn_01-GEN_v80.pdf",
            "size": 3075135,
            "download_count": 17,
            "created_at": "2024-04-28T12:00:56Z",
            "uuid": "aec0c259-0fd4-41d6-b1e5-861f2f6bc033",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_01-GEN_v80.pdf"
          },
          {
            "id": 10384,
            "name": "en_tn_02-EXO_v80.pdf",
            "size": 2484050,
            "download_count": 8,
            "created_at": "2024-04-28T12:00:57Z",
            "uuid": "e78d6a49-0895-49ff-9d23-c87c1821102b",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_02-EXO_v80.pdf"
          },
          {
            "id": 10385,
            "name": "en_tn_03-LEV_v80.pdf",
            "size": 1250851,
            "download_count": 8,
            "created_at": "2024-04-28T12:00:57Z",
            "uuid": "cc377bb4-e687-48e6-ae2e-392b732b5537",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_03-LEV_v80.pdf"
          },
          {
            "id": 10386,
            "name": "en_tn_04-NUM_v80.pdf",
            "size": 1799847,
            "download_count": 7,
            "created_at": "2024-04-28T12:00:58Z",
            "uuid": "023eb039-8879-47ae-a2cd-b89119c273f3",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_04-NUM_v80.pdf"
          },
          {
            "id": 10387,
            "name": "en_tn_05-DEU_v80.pdf",
            "size": 1769689,
            "download_count": 8,
            "created_at": "2024-04-28T12:00:58Z",
            "uuid": "7497aa41-fcab-4e12-8452-5e03d0236c21",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_05-DEU_v80.pdf"
          },
          {
            "id": 10388,
            "name": "en_tn_06-JOS_v80.pdf",
            "size": 1007221,
            "download_count": 7,
            "created_at": "2024-04-28T12:00:59Z",
            "uuid": "1a167664-8378-4c3a-850c-7ed6aee2b7c0",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_06-JOS_v80.pdf"
          },
          {
            "id": 10389,
            "name": "en_tn_07-JDG_v80.pdf",
            "size": 1164607,
            "download_count": 7,
            "created_at": "2024-04-28T12:00:59Z",
            "uuid": "cc546702-0aa7-448c-ad0f-4586cb2494a4",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_07-JDG_v80.pdf"
          },
          {
            "id": 10390,
            "name": "en_tn_08-RUT_v80.pdf",
            "size": 523977,
            "download_count": 10,
            "created_at": "2024-04-28T12:00:59Z",
            "uuid": "a4136af2-8a9e-4bd9-842a-3ff88b407bb9",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_08-RUT_v80.pdf"
          },
          {
            "id": 10391,
            "name": "en_tn_09-1SA_v80.pdf",
            "size": 1441787,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:00Z",
            "uuid": "3e3691cc-9ef2-4014-a245-ad242e0fe307",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_09-1SA_v80.pdf"
          },
          {
            "id": 10392,
            "name": "en_tn_10-2SA_v80.pdf",
            "size": 1337961,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:00Z",
            "uuid": "dc5986a3-a87d-4830-9a40-3f12d022e84f",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_10-2SA_v80.pdf"
          },
          {
            "id": 10393,
            "name": "en_tn_11-1KI_v80.pdf",
            "size": 1364669,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:01Z",
            "uuid": "040ea520-14b7-4d6c-a877-03d59fd4ce4e",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_11-1KI_v80.pdf"
          },
          {
            "id": 10394,
            "name": "en_tn_12-2KI_v80.pdf",
            "size": 1284993,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:01Z",
            "uuid": "29fbee9c-a076-4541-88ed-14119e0a1455",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_12-2KI_v80.pdf"
          },
          {
            "id": 10395,
            "name": "en_tn_13-1CH_v80.pdf",
            "size": 1487143,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:02Z",
            "uuid": "b9335230-9d45-4f1a-b545-40741b92bd46",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_13-1CH_v80.pdf"
          },
          {
            "id": 10396,
            "name": "en_tn_14-2CH_v80.pdf",
            "size": 1570482,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:02Z",
            "uuid": "fd653623-1663-44f4-929b-1aaae37fcc57",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_14-2CH_v80.pdf"
          },
          {
            "id": 10397,
            "name": "en_tn_15-EZR_v80.pdf",
            "size": 1355009,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:03Z",
            "uuid": "a19d51fe-3e9a-40b7-a3af-a64645f815d2",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_15-EZR_v80.pdf"
          },
          {
            "id": 10398,
            "name": "en_tn_16-NEH_v80.pdf",
            "size": 1547738,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:03Z",
            "uuid": "526ea790-1ab0-44c7-aed2-0923d1066478",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_16-NEH_v80.pdf"
          },
          {
            "id": 10399,
            "name": "en_tn_17-EST_v80.pdf",
            "size": 936694,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:03Z",
            "uuid": "cbc4e78b-bb74-4d5b-9014-f6e58f2a34af",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_17-EST_v80.pdf"
          },
          {
            "id": 10400,
            "name": "en_tn_18-JOB_v80.pdf",
            "size": 2771100,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:04Z",
            "uuid": "855cfcfa-a6cd-4892-b507-89dc075e43b9",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_18-JOB_v80.pdf"
          },
          {
            "id": 10401,
            "name": "en_tn_19-PSA_v80.pdf",
            "size": 3817326,
            "download_count": 9,
            "created_at": "2024-04-28T12:01:05Z",
            "uuid": "c234a46e-b569-4fc6-8a91-2a02df678433",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_19-PSA_v80.pdf"
          },
          {
            "id": 10402,
            "name": "en_tn_20-PRO_v80.pdf",
            "size": 2725700,
            "download_count": 13,
            "created_at": "2024-04-28T12:01:05Z",
            "uuid": "cba31799-c4ab-4318-8ff1-45559abac14b",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_20-PRO_v80.pdf"
          },
          {
            "id": 10403,
            "name": "en_tn_21-ECC_v80.pdf",
            "size": 637508,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:06Z",
            "uuid": "b148beed-5cfb-474e-9c0e-097346c744ca",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_21-ECC_v80.pdf"
          },
          {
            "id": 10404,
            "name": "en_tn_22-SNG_v80.pdf",
            "size": 757794,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:06Z",
            "uuid": "5c6e7891-f051-4b20-a522-dec4e947722d",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_22-SNG_v80.pdf"
          },
          {
            "id": 10405,
            "name": "en_tn_23-ISA_v80.pdf",
            "size": 2537615,
            "download_count": 9,
            "created_at": "2024-04-28T12:01:07Z",
            "uuid": "20a7fcc3-0260-442e-a9fd-de9c0c417fa1",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_23-ISA_v80.pdf"
          },
          {
            "id": 10406,
            "name": "en_tn_24-JER_v80.pdf",
            "size": 2481472,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:07Z",
            "uuid": "780152fb-21fb-48fe-9b82-9aa1fafb8a09",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_24-JER_v80.pdf"
          },
          {
            "id": 10407,
            "name": "en_tn_25-LAM_v80.pdf",
            "size": 552025,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:08Z",
            "uuid": "0cf6743e-7574-4bf4-a2c1-df9c15b77466",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_25-LAM_v80.pdf"
          },
          {
            "id": 10408,
            "name": "en_tn_26-EZK_v80.pdf",
            "size": 2128965,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:08Z",
            "uuid": "efa53962-a72b-486e-aaf7-8d17200c0cd1",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_26-EZK_v80.pdf"
          },
          {
            "id": 10409,
            "name": "en_tn_27-DAN_v80.pdf",
            "size": 836224,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:08Z",
            "uuid": "1b9904d3-e592-4126-8eda-c35c7871ba42",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_27-DAN_v80.pdf"
          },
          {
            "id": 10410,
            "name": "en_tn_28-HOS_v80.pdf",
            "size": 598967,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:09Z",
            "uuid": "85ac5707-9802-4ce6-8301-da16e1aa1364",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_28-HOS_v80.pdf"
          },
          {
            "id": 10411,
            "name": "en_tn_29-JOL_v80.pdf",
            "size": 365026,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:09Z",
            "uuid": "021ca6bf-1e10-4ee4-93d1-b1298d48fbf6",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_29-JOL_v80.pdf"
          },
          {
            "id": 10412,
            "name": "en_tn_30-AMO_v80.pdf",
            "size": 573927,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:09Z",
            "uuid": "0d6dfe39-a66c-4b57-a975-23b29069f5de",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_30-AMO_v80.pdf"
          },
          {
            "id": 10413,
            "name": "en_tn_31-OBA_v80.pdf",
            "size": 409999,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:10Z",
            "uuid": "1e796e35-f24d-4428-af33-4d3a282f6422",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_31-OBA_v80.pdf"
          },
          {
            "id": 10414,
            "name": "en_tn_32-JON_v80.pdf",
            "size": 510438,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:10Z",
            "uuid": "244ebb3c-c4a2-42d9-8ea1-f33735bc714f",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_32-JON_v80.pdf"
          },
          {
            "id": 10415,
            "name": "en_tn_33-MIC_v80.pdf",
            "size": 476401,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:10Z",
            "uuid": "e9e411a2-538b-4799-85ac-c312ff70e65e",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_33-MIC_v80.pdf"
          },
          {
            "id": 10416,
            "name": "en_tn_34-NAM_v80.pdf",
            "size": 361925,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:11Z",
            "uuid": "30f1a851-ec3b-4bbf-a3a0-e75a170cef15",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_34-NAM_v80.pdf"
          },
          {
            "id": 10417,
            "name": "en_tn_35-HAB_v80.pdf",
            "size": 351309,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:11Z",
            "uuid": "32c66a41-6c89-4183-880b-4d200703c690",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_35-HAB_v80.pdf"
          },
          {
            "id": 10418,
            "name": "en_tn_36-ZEP_v80.pdf",
            "size": 563008,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:12Z",
            "uuid": "cf54a2b6-6b53-435d-a446-07fdc70d158f",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_36-ZEP_v80.pdf"
          },
          {
            "id": 10419,
            "name": "en_tn_37-HAG_v80.pdf",
            "size": 415704,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:12Z",
            "uuid": "e4f50416-a9a9-447c-ab2f-00e3e8de7c17",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_37-HAG_v80.pdf"
          },
          {
            "id": 10420,
            "name": "en_tn_38-ZEC_v80.pdf",
            "size": 724567,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:12Z",
            "uuid": "940db8ff-c9af-4cb3-b1a3-e1235ac90086",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_38-ZEC_v80.pdf"
          },
          {
            "id": 10421,
            "name": "en_tn_39-MAL_v80.pdf",
            "size": 353296,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:13Z",
            "uuid": "d66729ee-c44f-4052-a8e5-accc90bf3c7a",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_39-MAL_v80.pdf"
          },
          {
            "id": 10422,
            "name": "en_tn_41-MAT_v80.pdf",
            "size": 2758987,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:13Z",
            "uuid": "477917cf-80d3-4ebd-9c0c-598b9ce99cd5",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_41-MAT_v80.pdf"
          },
          {
            "id": 10423,
            "name": "en_tn_42-MRK_v80.pdf",
            "size": 2482814,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:14Z",
            "uuid": "864b102d-0655-4630-b68e-1175c2147bf5",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_42-MRK_v80.pdf"
          },
          {
            "id": 10424,
            "name": "en_tn_43-LUK_v80.pdf",
            "size": 3381529,
            "download_count": 10,
            "created_at": "2024-04-28T12:01:14Z",
            "uuid": "4dd2361d-7f83-400f-a6b0-877ff70e5279",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_43-LUK_v80.pdf"
          },
          {
            "id": 10425,
            "name": "en_tn_44-JHN_v80.pdf",
            "size": 2510037,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:15Z",
            "uuid": "e2d65ee8-4e11-454d-ac19-583ab9bd8460",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_44-JHN_v80.pdf"
          },
          {
            "id": 10426,
            "name": "en_tn_45-ACT_v80.pdf",
            "size": 2957673,
            "download_count": 10,
            "created_at": "2024-04-28T12:01:15Z",
            "uuid": "e1abc375-597a-46d0-8d91-b6093995cf09",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_45-ACT_v80.pdf"
          },
          {
            "id": 10427,
            "name": "en_tn_46-ROM_v80.pdf",
            "size": 2249341,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:16Z",
            "uuid": "e4f33d51-8778-4541-9959-1662e8e211e6",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_46-ROM_v80.pdf"
          },
          {
            "id": 10428,
            "name": "en_tn_47-1CO_v80.pdf",
            "size": 2589929,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:16Z",
            "uuid": "dfa7a5a2-71f1-4e36-aafa-ea8f3006d68c",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_47-1CO_v80.pdf"
          },
          {
            "id": 10429,
            "name": "en_tn_48-2CO_v80.pdf",
            "size": 1640948,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:17Z",
            "uuid": "2edcb93f-294e-429c-b29c-56275bc1a26b",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_48-2CO_v80.pdf"
          },
          {
            "id": 10430,
            "name": "en_tn_49-GAL_v80.pdf",
            "size": 1077873,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:17Z",
            "uuid": "37a04b0f-032a-4c2e-a3d5-b550b2c9f0cf",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_49-GAL_v80.pdf"
          },
          {
            "id": 10431,
            "name": "en_tn_50-EPH_v80.pdf",
            "size": 599099,
            "download_count": 6,
            "created_at": "2024-04-28T12:01:18Z",
            "uuid": "91a21a7d-d3f9-4f3a-b337-8aa08efe9247",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_50-EPH_v80.pdf"
          },
          {
            "id": 10432,
            "name": "en_tn_51-PHP_v80.pdf",
            "size": 671295,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:18Z",
            "uuid": "e1297bea-02bc-4f73-a697-66005a4da121",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_51-PHP_v80.pdf"
          },
          {
            "id": 10433,
            "name": "en_tn_52-COL_v80.pdf",
            "size": 862289,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:18Z",
            "uuid": "296d8d41-9622-44a3-8f13-04eb7363502d",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_52-COL_v80.pdf"
          },
          {
            "id": 10434,
            "name": "en_tn_53-1TH_v80.pdf",
            "size": 907966,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:19Z",
            "uuid": "391d50a7-310d-4666-b4ec-3cad80f33952",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_53-1TH_v80.pdf"
          },
          {
            "id": 10435,
            "name": "en_tn_54-2TH_v80.pdf",
            "size": 506309,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:19Z",
            "uuid": "be540bb3-14ee-4c44-849d-bcb4be9f1960",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_54-2TH_v80.pdf"
          },
          {
            "id": 10436,
            "name": "en_tn_55-1TI_v80.pdf",
            "size": 888356,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:20Z",
            "uuid": "479e9e9d-cc0f-4996-b8d7-12c8f025803b",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_55-1TI_v80.pdf"
          },
          {
            "id": 10437,
            "name": "en_tn_56-2TI_v80.pdf",
            "size": 565674,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:20Z",
            "uuid": "8338b582-6d38-4543-8693-884f3c196e83",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_56-2TI_v80.pdf"
          },
          {
            "id": 10438,
            "name": "en_tn_57-TIT_v80.pdf",
            "size": 407708,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:21Z",
            "uuid": "2a3f08db-c173-4fb5-b06b-e04565bb4505",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_57-TIT_v80.pdf"
          },
          {
            "id": 10439,
            "name": "en_tn_58-PHM_v80.pdf",
            "size": 294376,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:21Z",
            "uuid": "d7eeb581-7911-4c8d-a4a2-be91b8fec459",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_58-PHM_v80.pdf"
          },
          {
            "id": 10440,
            "name": "en_tn_59-HEB_v80.pdf",
            "size": 1961404,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:22Z",
            "uuid": "aaaa7bb3-8209-419d-8c98-f0c13162377b",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_59-HEB_v80.pdf"
          },
          {
            "id": 10441,
            "name": "en_tn_60-JAS_v80.pdf",
            "size": 844089,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:22Z",
            "uuid": "ef353574-33e1-4c7b-9c7e-0b222dcb8c6e",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_60-JAS_v80.pdf"
          },
          {
            "id": 10442,
            "name": "en_tn_61-1PE_v80.pdf",
            "size": 772180,
            "download_count": 11,
            "created_at": "2024-04-28T12:01:23Z",
            "uuid": "2779b7c2-f751-4c1a-8329-9b5fb56ebd5d",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_61-1PE_v80.pdf"
          },
          {
            "id": 10443,
            "name": "en_tn_62-2PE_v80.pdf",
            "size": 701763,
            "download_count": 11,
            "created_at": "2024-04-28T12:01:23Z",
            "uuid": "c385f357-5cea-48cf-a29d-d22545951eb3",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_62-2PE_v80.pdf"
          },
          {
            "id": 10444,
            "name": "en_tn_63-1JN_v80.pdf",
            "size": 819615,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:24Z",
            "uuid": "510271af-a057-44f9-9533-d88fadd3ce27",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_63-1JN_v80.pdf"
          },
          {
            "id": 10445,
            "name": "en_tn_64-2JN_v80.pdf",
            "size": 318383,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:24Z",
            "uuid": "8400d367-4b49-4606-83e5-fd8d3741b3b8",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_64-2JN_v80.pdf"
          },
          {
            "id": 10446,
            "name": "en_tn_65-3JN_v80.pdf",
            "size": 269668,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:24Z",
            "uuid": "01e47fd8-3b83-4f03-96fa-04142c11a793",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_65-3JN_v80.pdf"
          },
          {
            "id": 10447,
            "name": "en_tn_66-JUD_v80.pdf",
            "size": 380756,
            "download_count": 7,
            "created_at": "2024-04-28T12:01:25Z",
            "uuid": "e80dd30c-2d81-4f41-8c41-145075f562e9",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_66-JUD_v80.pdf"
          },
          {
            "id": 10448,
            "name": "en_tn_67-REV_v80.pdf",
            "size": 1488706,
            "download_count": 8,
            "created_at": "2024-04-28T12:01:25Z",
            "uuid": "b4b0c90c-d875-44fd-bf44-c888a8e846b2",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tn/releases/download/v80/en_tn_67-REV_v80.pdf"
          }
        ],
        "door43_metadata": {
          "id": 42720,
          "url": "https://git.door43.org/api/v1/catalog/entry/unfoldingWord/en_tn/v80",
          "name": "en_tn",
          "owner": "unfoldingWord",
          "full_name": "unfoldingWord/en_tn",
          "tarbar_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.tar.gz",
          "zipball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
          "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/git/trees/v80?recursive=1&per_page=99999",
          "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/contents?ref=v80",
          "language": "en",
          "language_title": "English",
          "language_direction": "ltr",
          "language_is_gl": true,
          "subject": "TSV Translation Notes",
          "flavor_type": "parascriptural",
          "flavor": "x-TranslationNotes",
          "abbreviation": "tn",
          "title": "unfoldingWord® Translation Notes",
          "branch_or_tag_name": "v80",
          "ref_type": "tag",
          "commit_sha": "19a3000c0ff6d8d8046c5ff5866e555636240e30",
          "stage": "prod",
          "metadata_url": "https://git.door43.org/unfoldingWord/en_tn/raw/commit/19a3000c0ff6d8d8046c5ff5866e555636240e30/manifest.yaml",
          "metadata_json_url": "https://git.door43.org/api/v1/catalog/metadata/unfoldingWord/en_tn/v80",
          "metadata_api_contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/contents/manifest.yaml?ref=v80",
          "metadata_type": "rc",
          "metadata_version": "0.2",
          "content_format": "tsv9",
          "released": "2024-04-24T05:55:45Z",
          "ingredients": [
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "gen",
              "path": "tn_GEN.tsv",
              "sort": 1,
              "title": "Genesis",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "exo",
              "path": "tn_EXO.tsv",
              "sort": 2,
              "title": "Exodus",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "lev",
              "path": "tn_LEV.tsv",
              "sort": 3,
              "title": "Leviticus",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "num",
              "path": "tn_NUM.tsv",
              "sort": 4,
              "title": "Numbers",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "deu",
              "path": "tn_DEU.tsv",
              "sort": 5,
              "title": "Deuteronomy",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jos",
              "path": "tn_JOS.tsv",
              "sort": 6,
              "title": "Joshua",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jdg",
              "path": "tn_JDG.tsv",
              "sort": 7,
              "title": "Judges",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "rut",
              "path": "tn_RUT.tsv",
              "sort": 8,
              "title": "Ruth",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "1sa",
              "path": "tn_1SA.tsv",
              "sort": 9,
              "title": "1 Samuel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "2sa",
              "path": "tn_2SA.tsv",
              "sort": 10,
              "title": "2 Samuel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "1ki",
              "path": "tn_1KI.tsv",
              "sort": 11,
              "title": "1 Kings",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "2ki",
              "path": "tn_2KI.tsv",
              "sort": 12,
              "title": "2 Kings",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "1ch",
              "path": "tn_1CH.tsv",
              "sort": 13,
              "title": "1 Chronicles",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "2ch",
              "path": "tn_2CH.tsv",
              "sort": 14,
              "title": "2 Chronicles",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "ezr",
              "path": "tn_EZR.tsv",
              "sort": 15,
              "title": "Ezra",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "neh",
              "path": "tn_NEH.tsv",
              "sort": 16,
              "title": "Nehemiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "est",
              "path": "tn_EST.tsv",
              "sort": 17,
              "title": "Esther",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "job",
              "path": "tn_JOB.tsv",
              "sort": 18,
              "title": "Job",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "psa",
              "path": "tn_PSA.tsv",
              "sort": 19,
              "title": "Psalms",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "pro",
              "path": "tn_PRO.tsv",
              "sort": 20,
              "title": "Proverbs",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "ecc",
              "path": "tn_ECC.tsv",
              "sort": 21,
              "title": "Ecclesiastes",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "sng",
              "path": "tn_SNG.tsv",
              "sort": 22,
              "title": "Song of Solomon",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "isa",
              "path": "tn_ISA.tsv",
              "sort": 23,
              "title": "Isaiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jer",
              "path": "tn_JER.tsv",
              "sort": 24,
              "title": "Jeremiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "lam",
              "path": "tn_LAM.tsv",
              "sort": 25,
              "title": "Lamentations",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "ezk",
              "path": "tn_EZK.tsv",
              "sort": 26,
              "title": "Ezekiel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "dan",
              "path": "tn_DAN.tsv",
              "sort": 27,
              "title": "Daniel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "hos",
              "path": "tn_HOS.tsv",
              "sort": 28,
              "title": "Hosea",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jol",
              "path": "tn_JOL.tsv",
              "sort": 29,
              "title": "Joel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "amo",
              "path": "tn_AMO.tsv",
              "sort": 30,
              "title": "Amos",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "oba",
              "path": "tn_OBA.tsv",
              "sort": 31,
              "title": "Obadiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jon",
              "path": "tn_JON.tsv",
              "sort": 32,
              "title": "Jonah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "mic",
              "path": "tn_MIC.tsv",
              "sort": 33,
              "title": "Micah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "nam",
              "path": "tn_NAM.tsv",
              "sort": 34,
              "title": "Nahum",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "hab",
              "path": "tn_HAB.tsv",
              "sort": 35,
              "title": "Habakkuk",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "zep",
              "path": "tn_ZEP.tsv",
              "sort": 36,
              "title": "Zephaniah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "hag",
              "path": "tn_HAG.tsv",
              "sort": 37,
              "title": "Haggai",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "zec",
              "path": "tn_ZEC.tsv",
              "sort": 38,
              "title": "Zechariah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "mal",
              "path": "tn_MAL.tsv",
              "sort": 39,
              "title": "Malachi",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "mat",
              "path": "tn_MAT.tsv",
              "sort": 41,
              "title": "Matthew",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "mrk",
              "path": "tn_MRK.tsv",
              "sort": 42,
              "title": "Mark",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "luk",
              "path": "tn_LUK.tsv",
              "sort": 43,
              "title": "Luke",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "jhn",
              "path": "tn_JHN.tsv",
              "sort": 44,
              "title": "John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "act",
              "path": "tn_ACT.tsv",
              "sort": 45,
              "title": "Acts",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "rom",
              "path": "tn_ROM.tsv",
              "sort": 46,
              "title": "Romans",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1co",
              "path": "tn_1CO.tsv",
              "sort": 47,
              "title": "1 Corinthians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2co",
              "path": "tn_2CO.tsv",
              "sort": 48,
              "title": "2 Corinthians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "gal",
              "path": "tn_GAL.tsv",
              "sort": 49,
              "title": "Galatians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "eph",
              "path": "tn_EPH.tsv",
              "sort": 50,
              "title": "Ephesians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "php",
              "path": "tn_PHP.tsv",
              "sort": 51,
              "title": "Philippians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "col",
              "path": "tn_COL.tsv",
              "sort": 52,
              "title": "Colossians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1th",
              "path": "tn_1TH.tsv",
              "sort": 53,
              "title": "1 Thessalonians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2th",
              "path": "tn_2TH.tsv",
              "sort": 54,
              "title": "2 Thessalonians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1ti",
              "path": "tn_1TI.tsv",
              "sort": 55,
              "title": "1 Timothy",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2ti",
              "path": "tn_2TI.tsv",
              "sort": 56,
              "title": "2 Timothy",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "tit",
              "path": "tn_TIT.tsv",
              "sort": 57,
              "title": "Titus",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "phm",
              "path": "tn_PHM.tsv",
              "sort": 58,
              "title": "Philemon",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "heb",
              "path": "tn_HEB.tsv",
              "sort": 59,
              "title": "Hebrews",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "jas",
              "path": "tn_JAS.tsv",
              "sort": 60,
              "title": "James",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1pe",
              "path": "tn_1PE.tsv",
              "sort": 61,
              "title": "1 Peter",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2pe",
              "path": "tn_2PE.tsv",
              "sort": 62,
              "title": "2 Peter",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1jn",
              "path": "tn_1JN.tsv",
              "sort": 63,
              "title": "1 John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2jn",
              "path": "tn_2JN.tsv",
              "sort": 64,
              "title": "2 John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "3jn",
              "path": "tn_3JN.tsv",
              "sort": 65,
              "title": "3 John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "jud",
              "path": "tn_JUD.tsv",
              "sort": 66,
              "title": "Jude",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "rev",
              "path": "tn_REV.tsv",
              "sort": 67,
              "title": "Revelation",
              "versification": "ufw"
            }
          ],
          "books": [
            "gen",
            "exo",
            "lev",
            "num",
            "deu",
            "jos",
            "jdg",
            "rut",
            "1sa",
            "2sa",
            "1ki",
            "2ki",
            "1ch",
            "2ch",
            "ezr",
            "neh",
            "est",
            "job",
            "psa",
            "pro",
            "ecc",
            "sng",
            "isa",
            "jer",
            "lam",
            "ezk",
            "dan",
            "hos",
            "jol",
            "amo",
            "oba",
            "jon",
            "mic",
            "nam",
            "hab",
            "zep",
            "hag",
            "zec",
            "mal",
            "mat",
            "mrk",
            "luk",
            "jhn",
            "act",
            "rom",
            "1co",
            "2co",
            "gal",
            "eph",
            "php",
            "col",
            "1th",
            "2th",
            "1ti",
            "2ti",
            "tit",
            "phm",
            "heb",
            "jas",
            "1pe",
            "2pe",
            "1jn",
            "2jn",
            "3jn",
            "jud",
            "rev"
          ],
          "is_valid": true,
          "validation_errors_url": "https://git.door43.org/api/v1/catalog/validation/unfoldingWord/en_tn/v80"
        }
      },
      "tarbar_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.tar.gz",
      "zipball_url": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
      "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/git/trees/v80?recursive=1&per_page=99999",
      "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/contents?ref=v80",
      "language": "en",
      "language_title": "English",
      "language_direction": "ltr",
      "language_is_gl": true,
      "subject": "TSV_Translation_Notes",
      "flavor_type": "parascriptural",
      "flavor": "x-TranslationNotes",
      "abbreviation": "tn",
      "title": "unfoldingWord® Translation Notes",
      "branch_or_tag_name": "v80",
      "ref_type": "tag",
      "commit_sha": "19a3000c0ff6d8d8046c5ff5866e555636240e30",
      "stage": "prod",
      "metadata_url": "https://git.door43.org/unfoldingWord/en_tn/raw/commit/19a3000c0ff6d8d8046c5ff5866e555636240e30/manifest.yaml",
      "metadata_json_url": "https://git.door43.org/api/v1/catalog/metadata/unfoldingWord/en_tn/v80",
      "metadata_api_contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tn/contents/manifest.yaml?ref=v80",
      "metadata_type": "rc",
      "metadata_version": "0.2",
      "content_format": "tsv9",
      "released": "2024-04-24T05:55:45Z",
      "ingredients": [
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "gen",
          "path": "tn_GEN.tsv",
          "sort": 1,
          "title": "Genesis",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "exo",
          "path": "tn_EXO.tsv",
          "sort": 2,
          "title": "Exodus",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "lev",
          "path": "tn_LEV.tsv",
          "sort": 3,
          "title": "Leviticus",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "num",
          "path": "tn_NUM.tsv",
          "sort": 4,
          "title": "Numbers",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "deu",
          "path": "tn_DEU.tsv",
          "sort": 5,
          "title": "Deuteronomy",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "jos",
          "path": "tn_JOS.tsv",
          "sort": 6,
          "title": "Joshua",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "jdg",
          "path": "tn_JDG.tsv",
          "sort": 7,
          "title": "Judges",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "rut",
          "path": "tn_RUT.tsv",
          "sort": 8,
          "title": "Ruth",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "1sa",
          "path": "tn_1SA.tsv",
          "sort": 9,
          "title": "1 Samuel",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "2sa",
          "path": "tn_2SA.tsv",
          "sort": 10,
          "title": "2 Samuel",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "1ki",
          "path": "tn_1KI.tsv",
          "sort": 11,
          "title": "1 Kings",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "2ki",
          "path": "tn_2KI.tsv",
          "sort": 12,
          "title": "2 Kings",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "1ch",
          "path": "tn_1CH.tsv",
          "sort": 13,
          "title": "1 Chronicles",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "2ch",
          "path": "tn_2CH.tsv",
          "sort": 14,
          "title": "2 Chronicles",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "ezr",
          "path": "tn_EZR.tsv",
          "sort": 15,
          "title": "Ezra",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "neh",
          "path": "tn_NEH.tsv",
          "sort": 16,
          "title": "Nehemiah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "est",
          "path": "tn_EST.tsv",
          "sort": 17,
          "title": "Esther",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "job",
          "path": "tn_JOB.tsv",
          "sort": 18,
          "title": "Job",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "psa",
          "path": "tn_PSA.tsv",
          "sort": 19,
          "title": "Psalms",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "pro",
          "path": "tn_PRO.tsv",
          "sort": 20,
          "title": "Proverbs",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "ecc",
          "path": "tn_ECC.tsv",
          "sort": 21,
          "title": "Ecclesiastes",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "sng",
          "path": "tn_SNG.tsv",
          "sort": 22,
          "title": "Song of Solomon",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "isa",
          "path": "tn_ISA.tsv",
          "sort": 23,
          "title": "Isaiah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "jer",
          "path": "tn_JER.tsv",
          "sort": 24,
          "title": "Jeremiah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "lam",
          "path": "tn_LAM.tsv",
          "sort": 25,
          "title": "Lamentations",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "ezk",
          "path": "tn_EZK.tsv",
          "sort": 26,
          "title": "Ezekiel",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "dan",
          "path": "tn_DAN.tsv",
          "sort": 27,
          "title": "Daniel",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "hos",
          "path": "tn_HOS.tsv",
          "sort": 28,
          "title": "Hosea",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "jol",
          "path": "tn_JOL.tsv",
          "sort": 29,
          "title": "Joel",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "amo",
          "path": "tn_AMO.tsv",
          "sort": 30,
          "title": "Amos",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "oba",
          "path": "tn_OBA.tsv",
          "sort": 31,
          "title": "Obadiah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "jon",
          "path": "tn_JON.tsv",
          "sort": 32,
          "title": "Jonah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "mic",
          "path": "tn_MIC.tsv",
          "sort": 33,
          "title": "Micah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "nam",
          "path": "tn_NAM.tsv",
          "sort": 34,
          "title": "Nahum",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "hab",
          "path": "tn_HAB.tsv",
          "sort": 35,
          "title": "Habakkuk",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "zep",
          "path": "tn_ZEP.tsv",
          "sort": 36,
          "title": "Zephaniah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "hag",
          "path": "tn_HAG.tsv",
          "sort": 37,
          "title": "Haggai",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "zec",
          "path": "tn_ZEC.tsv",
          "sort": 38,
          "title": "Zechariah",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-ot"
          ],
          "identifier": "mal",
          "path": "tn_MAL.tsv",
          "sort": 39,
          "title": "Malachi",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "mat",
          "path": "tn_MAT.tsv",
          "sort": 41,
          "title": "Matthew",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "mrk",
          "path": "tn_MRK.tsv",
          "sort": 42,
          "title": "Mark",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "luk",
          "path": "tn_LUK.tsv",
          "sort": 43,
          "title": "Luke",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "jhn",
          "path": "tn_JHN.tsv",
          "sort": 44,
          "title": "John",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "act",
          "path": "tn_ACT.tsv",
          "sort": 45,
          "title": "Acts",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "rom",
          "path": "tn_ROM.tsv",
          "sort": 46,
          "title": "Romans",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "1co",
          "path": "tn_1CO.tsv",
          "sort": 47,
          "title": "1 Corinthians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "2co",
          "path": "tn_2CO.tsv",
          "sort": 48,
          "title": "2 Corinthians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "gal",
          "path": "tn_GAL.tsv",
          "sort": 49,
          "title": "Galatians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "eph",
          "path": "tn_EPH.tsv",
          "sort": 50,
          "title": "Ephesians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "php",
          "path": "tn_PHP.tsv",
          "sort": 51,
          "title": "Philippians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "col",
          "path": "tn_COL.tsv",
          "sort": 52,
          "title": "Colossians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "1th",
          "path": "tn_1TH.tsv",
          "sort": 53,
          "title": "1 Thessalonians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "2th",
          "path": "tn_2TH.tsv",
          "sort": 54,
          "title": "2 Thessalonians",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "1ti",
          "path": "tn_1TI.tsv",
          "sort": 55,
          "title": "1 Timothy",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "2ti",
          "path": "tn_2TI.tsv",
          "sort": 56,
          "title": "2 Timothy",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "tit",
          "path": "tn_TIT.tsv",
          "sort": 57,
          "title": "Titus",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "phm",
          "path": "tn_PHM.tsv",
          "sort": 58,
          "title": "Philemon",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "heb",
          "path": "tn_HEB.tsv",
          "sort": 59,
          "title": "Hebrews",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "jas",
          "path": "tn_JAS.tsv",
          "sort": 60,
          "title": "James",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "1pe",
          "path": "tn_1PE.tsv",
          "sort": 61,
          "title": "1 Peter",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "2pe",
          "path": "tn_2PE.tsv",
          "sort": 62,
          "title": "2 Peter",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "1jn",
          "path": "tn_1JN.tsv",
          "sort": 63,
          "title": "1 John",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "2jn",
          "path": "tn_2JN.tsv",
          "sort": 64,
          "title": "2 John",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "3jn",
          "path": "tn_3JN.tsv",
          "sort": 65,
          "title": "3 John",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "jud",
          "path": "tn_JUD.tsv",
          "sort": 66,
          "title": "Jude",
          "versification": "ufw"
        },
        {
          "categories": [
            "bible-nt"
          ],
          "identifier": "rev",
          "path": "tn_REV.tsv",
          "sort": 67,
          "title": "Revelation",
          "versification": "ufw"
        }
      ],
      "books": [
        "gen",
        "exo",
        "lev",
        "num",
        "deu",
        "jos",
        "jdg",
        "rut",
        "1sa",
        "2sa",
        "1ki",
        "2ki",
        "1ch",
        "2ch",
        "ezr",
        "neh",
        "est",
        "job",
        "psa",
        "pro",
        "ecc",
        "sng",
        "isa",
        "jer",
        "lam",
        "ezk",
        "dan",
        "hos",
        "jol",
        "amo",
        "oba",
        "jon",
        "mic",
        "nam",
        "hab",
        "zep",
        "hag",
        "zec",
        "mal",
        "mat",
        "mrk",
        "luk",
        "jhn",
        "act",
        "rom",
        "1co",
        "2co",
        "gal",
        "eph",
        "php",
        "col",
        "1th",
        "2th",
        "1ti",
        "2ti",
        "tit",
        "phm",
        "heb",
        "jas",
        "1pe",
        "2pe",
        "1jn",
        "2jn",
        "3jn",
        "jud",
        "rev"
      ],
      "is_valid": true,
      "validation_errors_url": "https://git.door43.org/api/v1/catalog/validation/unfoldingWord/en_tn/v80",
      "resourceId": "tn",
      "languageId": "en",
      "checking_level": 3,
      "foundInCatalog": "NEW",
      "modified": "2024-04-24T05:55:45Z",
      "downloadUrl": "https://git.door43.org/unfoldingWord/en_tn/archive/v80.zip",
      "version": "80"
    }
  }
}
const en_tw = {
  "languageId": "en",
  "resourceId": "tw",
  "remoteModifiedTime": "2024-04-24T05:55:28Z",
  "downloadUrl": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
  "version": "80",
  "subject": "Translation_Words",
  "owner": "unfoldingWord",
  "catalogEntry": {
    "subject": "Translation_Words",
    "resource": {
      "id": 42714,
      "url": "https://git.door43.org/api/v1/catalog/entry/unfoldingWord/en_tw/v80",
      "name": "en_tw",
      "owner": "unfoldingWord",
      "full_name": "unfoldingWord/en_tw",
      "repo": {
        "id": 4418,
        "owner": {
          "id": 613,
          "login": "unfoldingWord",
          "login_name": "",
          "full_name": "unfoldingWord®",
          "email": "unfoldingword@noreply.door43.org",
          "avatar_url": "https://git.door43.org/avatars/1bc81b740b4286613cdaa55ddfe4b1fc",
          "language": "",
          "is_admin": false,
          "last_login": "0001-01-01T00:00:00Z",
          "created": "2016-02-16T23:44:26Z",
          "repo_languages": [
            "el-x-koine",
            "en",
            "fr",
            "hbo"
          ],
          "repo_subjects": [
            "Aligned Bible",
            "Aramaic Grammar",
            "Bible",
            "Greek Grammar",
            "Greek Lexicon",
            "Greek New Testament",
            "Hebrew Grammar",
            "Hebrew Old Testament",
            "OBS Study Questions",
            "OBS Translation Notes",
            "OBS Translation Questions",
            "Open Bible Stories",
            "Study Notes",
            "Training Library",
            "Translation Academy",
            "Translation Words",
            "TSV OBS Study Notes",
            "TSV OBS Study Questions",
            "TSV OBS Translation Notes",
            "TSV OBS Translation Questions",
            "TSV OBS Translation Words Links",
            "TSV Study Notes",
            "TSV Study Questions",
            "TSV Translation Notes",
            "TSV Translation Questions",
            "TSV Translation Words Links"
          ],
          "repo_metadata_types": [
            "rc"
          ],
          "restricted": false,
          "active": false,
          "prohibit_login": false,
          "location": "",
          "website": "https://unfoldingword.org",
          "description": "",
          "visibility": "public",
          "followers_count": 0,
          "following_count": 0,
          "starred_repos_count": 0,
          "username": "unfoldingWord"
        },
        "name": "en_tw",
        "full_name": "unfoldingWord/en_tw",
        "description": "unfoldingWord® Translation Words",
        "empty": false,
        "private": false,
        "fork": false,
        "template": false,
        "parent": null,
        "mirror": false,
        "size": 31199,
        "languages_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/languages",
        "html_url": "https://git.door43.org/unfoldingWord/en_tw",
        "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw",
        "link": "",
        "ssh_url": "git@git.door43.org:unfoldingWord/en_tw.git",
        "clone_url": "https://git.door43.org/unfoldingWord/en_tw.git",
        "original_url": "",
        "website": "https://www.unfoldingword.org/utw",
        "stars_count": 6,
        "forks_count": 17,
        "watchers_count": 2,
        "open_issues_count": 737,
        "open_pr_counter": 1,
        "release_counter": 49,
        "default_branch": "master",
        "archived": false,
        "created_at": "2016-10-19T23:47:21Z",
        "updated_at": "2024-05-03T16:58:05Z",
        "archived_at": "1970-01-01T00:00:00Z",
        "permissions": {
          "admin": false,
          "push": false,
          "pull": true
        },
        "has_issues": true,
        "internal_tracker": {
          "enable_time_tracker": true,
          "allow_only_contributors_to_track_time": true,
          "enable_issue_dependencies": true
        },
        "has_wiki": false,
        "has_pull_requests": true,
        "has_projects": false,
        "has_releases": true,
        "has_packages": false,
        "has_actions": false,
        "ignore_whitespace_conflicts": false,
        "allow_merge_commits": true,
        "allow_rebase": false,
        "allow_rebase_explicit": false,
        "allow_squash_merge": true,
        "allow_rebase_update": true,
        "default_delete_branch_after_merge": false,
        "default_merge_style": "squash",
        "default_allow_maintainer_edit": false,
        "avatar_url": "https://git.door43.org/repo-avatars/4418-4b548b1c7b556c577f1b577feb886da9",
        "internal": false,
        "mirror_interval": "",
        "mirror_updated": "0001-01-01T00:00:00Z",
        "repo_transfer": null,
        "metadata_type": "rc",
        "metadata_version": "0.2",
        "language": "en",
        "language_title": "English",
        "language_direction": "ltr",
        "language_is_gl": true,
        "subject": "Translation Words",
        "flavor_type": "gloss",
        "flavor": "x-TranslationWords",
        "abbreviation": "tw",
        "title": "unfoldingWord® Translation Words",
        "ingredients": [
          {
            "categories": null,
            "identifier": "bible",
            "path": "./bible",
            "sort": 0,
            "title": "unfoldingWord® Translation Words",
            "versification": ""
          }
        ],
        "checking_level": 3,
        "catalog": {
          "prod": {
            "branch_or_tag_name": "v80",
            "release_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/releases/10974003",
            "commit_sha": "6c1c5231c1d6865a108840df5adcffbd444ac558",
            "released": "2024-04-24T05:55:28Z",
            "zipball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
            "tarball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.tar.gz",
            "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/git/trees/v80?recursive=1&per_page=99999",
            "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/contents?ref=v80"
          },
          "preprod": null,
          "latest": {
            "branch_or_tag_name": "master",
            "release_url": null,
            "commit_sha": "ece4aa154485e21605838946251df5fe81e3b389",
            "released": "2024-05-03T16:57:34Z",
            "zipball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/ece4aa1544.zip",
            "tarball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/ece4aa1544.tar.gz",
            "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/git/trees/ece4aa1544?recursive=1&per_page=99999",
            "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/contents?ref=ece4aa1544"
          }
        },
        "content_format": "markdown"
      },
      "release": {
        "id": 10974003,
        "tag_name": "v80",
        "target_commitish": "master",
        "name": "Version 80",
        "body": "This version includes the book package of 3 John (3JN).\n\nConsistency Check\nThe following books have undergone a Book Package consistency check:\n\nGenesis (GEN)\nExodus (EXO)\nRuth (RUT)\nEzra (EZR)\nNehemiah (NEH)\nEsther (EST)\nJob (JOB)\nProverbs (PRO)\nSong of Songs (SOS)\nObadiah (OBA)\nJonah (JON)\nZephaniah(ZEP)\nHaggai (HAG)\nMatthew (MAT)\nMark (MRK)\nLuke (LUK)\nJohn (JHN)\nActs (ACT)\nRomans (ROM)\n1 Corinthians (1CO)\n2 Corinthians (2CO)\nGalatians (GAL)\nEphesians (EPH)\nPhilippians (PHP)\nColossians (COL)\n1 Thessalonians (1TH)\n2 Thessalonians (2TH)\n1 Timothy (1TI)\n2 Timothy (2TI)\nTitus (TIT)\nPhilemon (PHM)\nHebrews (HEB)\nJames (JAS)\n1 Peter (1PE)\n2 Peter (2PE)\n1 John (1JN)\n2 John (2JN)\n3 John (3JN)\nJude (JUD)\nRevelation (REV)",
        "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/releases/10974003",
        "html_url": "https://git.door43.org/unfoldingWord/en_tw/releases/tag/v80",
        "tarball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.tar.gz",
        "zipball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
        "upload_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/releases/10974003/assets",
        "draft": false,
        "prerelease": false,
        "created_at": "2024-04-24T05:55:28Z",
        "published_at": "2024-04-24T05:55:28Z",
        "author": {
          "id": 52596,
          "login": "Seema",
          "login_name": "",
          "full_name": "",
          "email": "seema@noreply.door43.org",
          "avatar_url": "https://secure.gravatar.com/avatar/0fe97aef1bc7759077f642f9360659be?d=identicon",
          "language": "",
          "is_admin": false,
          "last_login": "0001-01-01T00:00:00Z",
          "created": "2023-06-26T05:40:38Z",
          "repo_languages": [
            "en",
            "hi"
          ],
          "repo_subjects": [
            "Aligned Bible",
            "Open Bible Stories"
          ],
          "repo_metadata_types": [
            "sb",
            "tc"
          ],
          "restricted": false,
          "active": false,
          "prohibit_login": false,
          "location": "",
          "website": "",
          "description": "",
          "visibility": "public",
          "followers_count": 0,
          "following_count": 0,
          "starred_repos_count": 0,
          "username": "Seema"
        },
        "assets": [
          {
            "id": 10585,
            "name": "en_tw_v80.pdf",
            "size": 2759759,
            "download_count": 42,
            "created_at": "2024-04-28T12:43:04Z",
            "uuid": "576bcafa-1ae6-4151-9cee-6e293041f776",
            "browser_download_url": "https://git.door43.org/unfoldingWord/en_tw/releases/download/v80/en_tw_v80.pdf"
          }
        ],
        "door43_metadata": {
          "id": 42714,
          "url": "https://git.door43.org/api/v1/catalog/entry/unfoldingWord/en_tw/v80",
          "name": "en_tw",
          "owner": "unfoldingWord",
          "full_name": "unfoldingWord/en_tw",
          "tarbar_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.tar.gz",
          "zipball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
          "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/git/trees/v80?recursive=1&per_page=99999",
          "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/contents?ref=v80",
          "language": "en",
          "language_title": "English",
          "language_direction": "ltr",
          "language_is_gl": true,
          "subject": "Translation Words",
          "flavor_type": "gloss",
          "flavor": "x-TranslationWords",
          "abbreviation": "tw",
          "title": "unfoldingWord® Translation Words",
          "branch_or_tag_name": "v80",
          "ref_type": "tag",
          "commit_sha": "6c1c5231c1d6865a108840df5adcffbd444ac558",
          "stage": "prod",
          "metadata_url": "https://git.door43.org/unfoldingWord/en_tw/raw/commit/6c1c5231c1d6865a108840df5adcffbd444ac558/manifest.yaml",
          "metadata_json_url": "https://git.door43.org/api/v1/catalog/metadata/unfoldingWord/en_tw/v80",
          "metadata_api_contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/contents/manifest.yaml?ref=v80",
          "metadata_type": "rc",
          "metadata_version": "0.2",
          "content_format": "markdown",
          "released": "2024-04-24T05:55:28Z",
          "ingredients": [
            {
              "categories": null,
              "identifier": "bible",
              "path": "./bible",
              "sort": 0,
              "title": "unfoldingWord® Translation Words",
              "versification": ""
            }
          ],
          "books": [
            "bible"
          ],
          "is_valid": true,
          "validation_errors_url": "https://git.door43.org/api/v1/catalog/validation/unfoldingWord/en_tw/v80"
        }
      },
      "tarbar_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.tar.gz",
      "zipball_url": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
      "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/git/trees/v80?recursive=1&per_page=99999",
      "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/contents?ref=v80",
      "language": "en",
      "language_title": "English",
      "language_direction": "ltr",
      "language_is_gl": true,
      "subject": "Translation_Words",
      "flavor_type": "gloss",
      "flavor": "x-TranslationWords",
      "abbreviation": "tw",
      "title": "unfoldingWord® Translation Words",
      "branch_or_tag_name": "v80",
      "ref_type": "tag",
      "commit_sha": "6c1c5231c1d6865a108840df5adcffbd444ac558",
      "stage": "prod",
      "metadata_url": "https://git.door43.org/unfoldingWord/en_tw/raw/commit/6c1c5231c1d6865a108840df5adcffbd444ac558/manifest.yaml",
      "metadata_json_url": "https://git.door43.org/api/v1/catalog/metadata/unfoldingWord/en_tw/v80",
      "metadata_api_contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tw/contents/manifest.yaml?ref=v80",
      "metadata_type": "rc",
      "metadata_version": "0.2",
      "content_format": "markdown",
      "released": "2024-04-24T05:55:28Z",
      "ingredients": [
        {
          "categories": null,
          "identifier": "bible",
          "path": "./bible",
          "sort": 0,
          "title": "unfoldingWord® Translation Words",
          "versification": ""
        }
      ],
      "books": [
        "bible"
      ],
      "is_valid": true,
      "validation_errors_url": "https://git.door43.org/api/v1/catalog/validation/unfoldingWord/en_tw/v80",
      "resourceId": "tw",
      "languageId": "en",
      "checking_level": 3,
      "foundInCatalog": "NEW",
      "modified": "2024-04-24T05:55:28Z",
      "downloadUrl": "https://git.door43.org/unfoldingWord/en_tw/archive/v80.zip",
      "version": "80",
      "loadAfter": [
        {
          "id": 42719,
          "url": "https://git.door43.org/api/v1/catalog/entry/unfoldingWord/en_twl/v80",
          "name": "en_twl",
          "owner": "unfoldingWord",
          "full_name": "unfoldingWord/en_twl",
          "repo": {
            "id": 60478,
            "owner": {
              "id": 613,
              "login": "unfoldingWord",
              "login_name": "",
              "full_name": "unfoldingWord®",
              "email": "unfoldingword@noreply.door43.org",
              "avatar_url": "https://git.door43.org/avatars/1bc81b740b4286613cdaa55ddfe4b1fc",
              "language": "",
              "is_admin": false,
              "last_login": "0001-01-01T00:00:00Z",
              "created": "2016-02-16T23:44:26Z",
              "repo_languages": [
                "el-x-koine",
                "en",
                "fr",
                "hbo"
              ],
              "repo_subjects": [
                "Aligned Bible",
                "Aramaic Grammar",
                "Bible",
                "Greek Grammar",
                "Greek Lexicon",
                "Greek New Testament",
                "Hebrew Grammar",
                "Hebrew Old Testament",
                "OBS Study Questions",
                "OBS Translation Notes",
                "OBS Translation Questions",
                "Open Bible Stories",
                "Study Notes",
                "Training Library",
                "Translation Academy",
                "Translation Words",
                "TSV OBS Study Notes",
                "TSV OBS Study Questions",
                "TSV OBS Translation Notes",
                "TSV OBS Translation Questions",
                "TSV OBS Translation Words Links",
                "TSV Study Notes",
                "TSV Study Questions",
                "TSV Translation Notes",
                "TSV Translation Questions",
                "TSV Translation Words Links"
              ],
              "repo_metadata_types": [
                "rc"
              ],
              "restricted": false,
              "active": false,
              "prohibit_login": false,
              "location": "",
              "website": "https://unfoldingword.org",
              "description": "",
              "visibility": "public",
              "followers_count": 0,
              "following_count": 0,
              "starred_repos_count": 0,
              "username": "unfoldingWord"
            },
            "name": "en_twl",
            "full_name": "unfoldingWord/en_twl",
            "description": "Links from the original language words to Translation Words articles.",
            "empty": false,
            "private": false,
            "fork": false,
            "template": false,
            "parent": null,
            "mirror": false,
            "size": 18399,
            "languages_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/languages",
            "html_url": "https://git.door43.org/unfoldingWord/en_twl",
            "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl",
            "link": "",
            "ssh_url": "git@git.door43.org:unfoldingWord/en_twl.git",
            "clone_url": "https://git.door43.org/unfoldingWord/en_twl.git",
            "original_url": "",
            "website": "",
            "stars_count": 1,
            "forks_count": 11,
            "watchers_count": 0,
            "open_issues_count": 4,
            "open_pr_counter": 2,
            "release_counter": 31,
            "default_branch": "master",
            "archived": false,
            "created_at": "2020-11-10T22:43:06Z",
            "updated_at": "2024-06-07T15:53:53Z",
            "archived_at": "1970-01-01T00:00:00Z",
            "permissions": {
              "admin": false,
              "push": false,
              "pull": true
            },
            "has_issues": true,
            "internal_tracker": {
              "enable_time_tracker": true,
              "allow_only_contributors_to_track_time": true,
              "enable_issue_dependencies": true
            },
            "has_wiki": false,
            "has_pull_requests": true,
            "has_projects": false,
            "has_releases": true,
            "has_packages": false,
            "has_actions": false,
            "ignore_whitespace_conflicts": false,
            "allow_merge_commits": true,
            "allow_rebase": true,
            "allow_rebase_explicit": true,
            "allow_squash_merge": true,
            "allow_rebase_update": true,
            "default_delete_branch_after_merge": false,
            "default_merge_style": "merge",
            "default_allow_maintainer_edit": false,
            "avatar_url": "https://git.door43.org/repo-avatars/60478-b185b8a5d8e5fecc2b0cba375b097b69",
            "internal": false,
            "mirror_interval": "",
            "mirror_updated": "0001-01-01T00:00:00Z",
            "repo_transfer": null,
            "metadata_type": "rc",
            "metadata_version": "0.2",
            "language": "en",
            "language_title": "English",
            "language_direction": "ltr",
            "language_is_gl": true,
            "subject": "TSV Translation Words Links",
            "flavor_type": "parascriptural",
            "flavor": "x-TranslationWordsLinks",
            "abbreviation": "twl",
            "title": "unfoldingWord® Translation Words Links",
            "ingredients": [
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "gen",
                "path": "./twl_GEN.tsv",
                "sort": 1,
                "title": "Genesis",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "exo",
                "path": "./twl_EXO.tsv",
                "sort": 2,
                "title": "Exodus",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "lev",
                "path": "./twl_LEV.tsv",
                "sort": 3,
                "title": "Leviticus",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "num",
                "path": "./twl_NUM.tsv",
                "sort": 4,
                "title": "Numbers",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "deu",
                "path": "./twl_DEU.tsv",
                "sort": 5,
                "title": "Deuteronomy",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "jos",
                "path": "./twl_JOS.tsv",
                "sort": 6,
                "title": "Joshua",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "jdg",
                "path": "./twl_JDG.tsv",
                "sort": 7,
                "title": "Judges",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "rut",
                "path": "./twl_RUT.tsv",
                "sort": 8,
                "title": "Ruth",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "1sa",
                "path": "./twl_1SA.tsv",
                "sort": 9,
                "title": "1 Samuel",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "2sa",
                "path": "./twl_2SA.tsv",
                "sort": 10,
                "title": "2 Samuel",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "1ki",
                "path": "./twl_1KI.tsv",
                "sort": 11,
                "title": "1 Kings",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "2ki",
                "path": "./twl_2KI.tsv",
                "sort": 12,
                "title": "2 Kings",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "1ch",
                "path": "./twl_1CH.tsv",
                "sort": 13,
                "title": "1 Chronicles",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "2ch",
                "path": "./twl_2CH.tsv",
                "sort": 14,
                "title": "2 Chronicles",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "ezr",
                "path": "./twl_EZR.tsv",
                "sort": 15,
                "title": "Ezra",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "neh",
                "path": "./twl_NEH.tsv",
                "sort": 16,
                "title": "Nehemiah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "est",
                "path": "./twl_EST.tsv",
                "sort": 17,
                "title": "Esther",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "job",
                "path": "./twl_JOB.tsv",
                "sort": 18,
                "title": "Job",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "psa",
                "path": "./twl_PSA.tsv",
                "sort": 19,
                "title": "Psalms",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "pro",
                "path": "./twl_PRO.tsv",
                "sort": 20,
                "title": "Proverbs",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "ecc",
                "path": "./twl_ECC.tsv",
                "sort": 21,
                "title": "Ecclesiastes",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "sng",
                "path": "./twl_SNG.tsv",
                "sort": 22,
                "title": "Song of Solomon",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "isa",
                "path": "./twl_ISA.tsv",
                "sort": 23,
                "title": "Isaiah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "jer",
                "path": "./twl_JER.tsv",
                "sort": 24,
                "title": "Jeremiah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "lam",
                "path": "./twl_LAM.tsv",
                "sort": 25,
                "title": "Lamentations",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "ezk",
                "path": "./twl_EZK.tsv",
                "sort": 26,
                "title": "Ezekiel",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "dan",
                "path": "./twl_DAN.tsv",
                "sort": 27,
                "title": "Daniel",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "hos",
                "path": "./twl_HOS.tsv",
                "sort": 28,
                "title": "Hosea",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "jol",
                "path": "./twl_JOL.tsv",
                "sort": 29,
                "title": "Joel",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "amo",
                "path": "./twl_AMO.tsv",
                "sort": 30,
                "title": "Amos",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "oba",
                "path": "./twl_OBA.tsv",
                "sort": 31,
                "title": "Obadiah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "jon",
                "path": "./twl_JON.tsv",
                "sort": 32,
                "title": "Jonah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "mic",
                "path": "./twl_MIC.tsv",
                "sort": 33,
                "title": "Micah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "nam",
                "path": "./twl_NAM.tsv",
                "sort": 34,
                "title": "Nahum",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "hab",
                "path": "./twl_HAB.tsv",
                "sort": 35,
                "title": "Habakkuk",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "zep",
                "path": "./twl_ZEP.tsv",
                "sort": 36,
                "title": "Zephaniah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "hag",
                "path": "./twl_HAG.tsv",
                "sort": 37,
                "title": "Haggai",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "zec",
                "path": "./twl_ZEC.tsv",
                "sort": 38,
                "title": "Zechariah",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-ot"
                ],
                "identifier": "mal",
                "path": "./twl_MAL.tsv",
                "sort": 39,
                "title": "Malachi",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "mat",
                "path": "./twl_MAT.tsv",
                "sort": 41,
                "title": "Matthew",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "mrk",
                "path": "./twl_MRK.tsv",
                "sort": 42,
                "title": "Mark",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "luk",
                "path": "./twl_LUK.tsv",
                "sort": 43,
                "title": "Luke",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "jhn",
                "path": "./twl_JHN.tsv",
                "sort": 44,
                "title": "John",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "act",
                "path": "./twl_ACT.tsv",
                "sort": 45,
                "title": "Acts",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "rom",
                "path": "./twl_ROM.tsv",
                "sort": 46,
                "title": "Romans",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "1co",
                "path": "./twl_1CO.tsv",
                "sort": 47,
                "title": "1 Corinthians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "2co",
                "path": "./twl_2CO.tsv",
                "sort": 48,
                "title": "2 Corinthians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "gal",
                "path": "./twl_GAL.tsv",
                "sort": 49,
                "title": "Galatians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "eph",
                "path": "./twl_EPH.tsv",
                "sort": 50,
                "title": "Ephesians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "php",
                "path": "./twl_PHP.tsv",
                "sort": 51,
                "title": "Philippians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "col",
                "path": "./twl_COL.tsv",
                "sort": 52,
                "title": "Colossians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "1th",
                "path": "./twl_1TH.tsv",
                "sort": 53,
                "title": "1 Thessalonians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "2th",
                "path": "./twl_2TH.tsv",
                "sort": 54,
                "title": "2 Thessalonians",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "1ti",
                "path": "./twl_1TI.tsv",
                "sort": 55,
                "title": "1 Timothy",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "2ti",
                "path": "./twl_2TI.tsv",
                "sort": 56,
                "title": "2 Timothy",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "tit",
                "path": "./twl_TIT.tsv",
                "sort": 57,
                "title": "Titus",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "phm",
                "path": "./twl_PHM.tsv",
                "sort": 58,
                "title": "Philemon",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "heb",
                "path": "./twl_HEB.tsv",
                "sort": 59,
                "title": "Hebrews",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "jas",
                "path": "./twl_JAS.tsv",
                "sort": 60,
                "title": "James",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "1pe",
                "path": "./twl_1PE.tsv",
                "sort": 61,
                "title": "1 Peter",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "2pe",
                "path": "./twl_2PE.tsv",
                "sort": 62,
                "title": "2 Peter",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "1jn",
                "path": "./twl_1JN.tsv",
                "sort": 63,
                "title": "1 John",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "2jn",
                "path": "./twl_2JN.tsv",
                "sort": 64,
                "title": "2 John",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "3jn",
                "path": "./twl_3JN.tsv",
                "sort": 65,
                "title": "3 John",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "jud",
                "path": "./twl_JUD.tsv",
                "sort": 66,
                "title": "Jude",
                "versification": "ufw"
              },
              {
                "categories": [
                  "bible-nt"
                ],
                "identifier": "rev",
                "path": "./twl_REV.tsv",
                "sort": 67,
                "title": "Revelation",
                "versification": "ufw"
              }
            ],
            "checking_level": 3,
            "catalog": {
              "prod": {
                "branch_or_tag_name": "v80",
                "release_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/releases/10974005",
                "commit_sha": "98d3ea0ca9a3c57eeff56b21fb37f6ebfc5075e2",
                "released": "2024-04-24T05:55:44Z",
                "zipball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.zip",
                "tarball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.tar.gz",
                "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/git/trees/v80?recursive=1&per_page=99999",
                "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/contents?ref=v80"
              },
              "preprod": null,
              "latest": {
                "branch_or_tag_name": "master",
                "release_url": null,
                "commit_sha": "013b2817d5a901090e435a80eeb3f226ce2d3a9f",
                "released": "2024-06-03T15:48:55Z",
                "zipball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/013b2817d5.zip",
                "tarball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/013b2817d5.tar.gz",
                "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/git/trees/013b2817d5?recursive=1&per_page=99999",
                "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/contents?ref=013b2817d5"
              }
            },
            "content_format": "tsv9"
          },
          "release": {
            "id": 10974005,
            "tag_name": "v80",
            "target_commitish": "release_v80",
            "name": "Version 80",
            "body": "This version includes the book package of 3 John (3JN).\n\nConsistency Check\nThe following books have undergone a Book Package consistency check:\n\nGenesis (GEN)\nExodus (EXO)\nRuth (RUT)\nEzra (EZR)\nNehemiah (NEH)\nEsther (EST)\nJob (JOB)\nProverbs (PRO)\nSong of Songs (SOS)\nObadiah (OBA)\nJonah (JON)\nZephaniah(ZEP)\nHaggai (HAG)\nMatthew (MAT)\nMark (MRK)\nLuke (LUK)\nJohn (JHN)\nActs (ACT)\nRomans (ROM)\n1 Corinthians (1CO)\n2 Corinthians (2CO)\nGalatians (GAL)\nEphesians (EPH)\nPhilippians (PHP)\nColossians (COL)\n1 Thessalonians (1TH)\n2 Thessalonians (2TH)\n1 Timothy (1TI)\n2 Timothy (2TI)\nTitus (TIT)\nPhilemon (PHM)\nHebrews (HEB)\nJames (JAS)\n1 Peter (1PE)\n2 Peter (2PE)\n1 John (1JN)\n2 John (2JN)\n3 John (3JN)\nJude (JUD)\nRevelation (REV)",
            "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/releases/10974005",
            "html_url": "https://git.door43.org/unfoldingWord/en_twl/releases/tag/v80",
            "tarball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.tar.gz",
            "zipball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.zip",
            "upload_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/releases/10974005/assets",
            "draft": false,
            "prerelease": false,
            "created_at": "2024-04-24T05:55:44Z",
            "published_at": "2024-04-24T05:55:44Z",
            "author": {
              "id": 52596,
              "login": "Seema",
              "login_name": "",
              "full_name": "",
              "email": "seema@noreply.door43.org",
              "avatar_url": "https://secure.gravatar.com/avatar/0fe97aef1bc7759077f642f9360659be?d=identicon",
              "language": "",
              "is_admin": false,
              "last_login": "0001-01-01T00:00:00Z",
              "created": "2023-06-26T05:40:38Z",
              "repo_languages": [
                "en",
                "hi"
              ],
              "repo_subjects": [
                "Aligned Bible",
                "Open Bible Stories"
              ],
              "repo_metadata_types": [
                "sb",
                "tc"
              ],
              "restricted": false,
              "active": false,
              "prohibit_login": false,
              "location": "",
              "website": "",
              "description": "",
              "visibility": "public",
              "followers_count": 0,
              "following_count": 0,
              "starred_repos_count": 0,
              "username": "Seema"
            },
            "assets": [],
            "door43_metadata": {
              "id": 42719,
              "url": "https://git.door43.org/api/v1/catalog/entry/unfoldingWord/en_twl/v80",
              "name": "en_twl",
              "owner": "unfoldingWord",
              "full_name": "unfoldingWord/en_twl",
              "tarbar_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.tar.gz",
              "zipball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.zip",
              "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/git/trees/v80?recursive=1&per_page=99999",
              "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/contents?ref=v80",
              "language": "en",
              "language_title": "English",
              "language_direction": "ltr",
              "language_is_gl": true,
              "subject": "TSV Translation Words Links",
              "flavor_type": "parascriptural",
              "flavor": "x-TranslationWordsLinks",
              "abbreviation": "twl",
              "title": "unfoldingWord® Translation Words Links",
              "branch_or_tag_name": "v80",
              "ref_type": "tag",
              "commit_sha": "98d3ea0ca9a3c57eeff56b21fb37f6ebfc5075e2",
              "stage": "prod",
              "metadata_url": "https://git.door43.org/unfoldingWord/en_twl/raw/commit/98d3ea0ca9a3c57eeff56b21fb37f6ebfc5075e2/manifest.yaml",
              "metadata_json_url": "https://git.door43.org/api/v1/catalog/metadata/unfoldingWord/en_twl/v80",
              "metadata_api_contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/contents/manifest.yaml?ref=v80",
              "metadata_type": "rc",
              "metadata_version": "0.2",
              "content_format": "tsv9",
              "released": "2024-04-24T05:55:44Z",
              "ingredients": [
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "gen",
                  "path": "./twl_GEN.tsv",
                  "sort": 1,
                  "title": "Genesis",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "exo",
                  "path": "./twl_EXO.tsv",
                  "sort": 2,
                  "title": "Exodus",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "lev",
                  "path": "./twl_LEV.tsv",
                  "sort": 3,
                  "title": "Leviticus",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "num",
                  "path": "./twl_NUM.tsv",
                  "sort": 4,
                  "title": "Numbers",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "deu",
                  "path": "./twl_DEU.tsv",
                  "sort": 5,
                  "title": "Deuteronomy",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "jos",
                  "path": "./twl_JOS.tsv",
                  "sort": 6,
                  "title": "Joshua",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "jdg",
                  "path": "./twl_JDG.tsv",
                  "sort": 7,
                  "title": "Judges",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "rut",
                  "path": "./twl_RUT.tsv",
                  "sort": 8,
                  "title": "Ruth",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "1sa",
                  "path": "./twl_1SA.tsv",
                  "sort": 9,
                  "title": "1 Samuel",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "2sa",
                  "path": "./twl_2SA.tsv",
                  "sort": 10,
                  "title": "2 Samuel",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "1ki",
                  "path": "./twl_1KI.tsv",
                  "sort": 11,
                  "title": "1 Kings",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "2ki",
                  "path": "./twl_2KI.tsv",
                  "sort": 12,
                  "title": "2 Kings",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "1ch",
                  "path": "./twl_1CH.tsv",
                  "sort": 13,
                  "title": "1 Chronicles",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "2ch",
                  "path": "./twl_2CH.tsv",
                  "sort": 14,
                  "title": "2 Chronicles",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "ezr",
                  "path": "./twl_EZR.tsv",
                  "sort": 15,
                  "title": "Ezra",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "neh",
                  "path": "./twl_NEH.tsv",
                  "sort": 16,
                  "title": "Nehemiah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "est",
                  "path": "./twl_EST.tsv",
                  "sort": 17,
                  "title": "Esther",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "job",
                  "path": "./twl_JOB.tsv",
                  "sort": 18,
                  "title": "Job",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "psa",
                  "path": "./twl_PSA.tsv",
                  "sort": 19,
                  "title": "Psalms",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "pro",
                  "path": "./twl_PRO.tsv",
                  "sort": 20,
                  "title": "Proverbs",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "ecc",
                  "path": "./twl_ECC.tsv",
                  "sort": 21,
                  "title": "Ecclesiastes",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "sng",
                  "path": "./twl_SNG.tsv",
                  "sort": 22,
                  "title": "Song of Solomon",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "isa",
                  "path": "./twl_ISA.tsv",
                  "sort": 23,
                  "title": "Isaiah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "jer",
                  "path": "./twl_JER.tsv",
                  "sort": 24,
                  "title": "Jeremiah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "lam",
                  "path": "./twl_LAM.tsv",
                  "sort": 25,
                  "title": "Lamentations",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "ezk",
                  "path": "./twl_EZK.tsv",
                  "sort": 26,
                  "title": "Ezekiel",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "dan",
                  "path": "./twl_DAN.tsv",
                  "sort": 27,
                  "title": "Daniel",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "hos",
                  "path": "./twl_HOS.tsv",
                  "sort": 28,
                  "title": "Hosea",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "jol",
                  "path": "./twl_JOL.tsv",
                  "sort": 29,
                  "title": "Joel",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "amo",
                  "path": "./twl_AMO.tsv",
                  "sort": 30,
                  "title": "Amos",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "oba",
                  "path": "./twl_OBA.tsv",
                  "sort": 31,
                  "title": "Obadiah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "jon",
                  "path": "./twl_JON.tsv",
                  "sort": 32,
                  "title": "Jonah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "mic",
                  "path": "./twl_MIC.tsv",
                  "sort": 33,
                  "title": "Micah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "nam",
                  "path": "./twl_NAM.tsv",
                  "sort": 34,
                  "title": "Nahum",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "hab",
                  "path": "./twl_HAB.tsv",
                  "sort": 35,
                  "title": "Habakkuk",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "zep",
                  "path": "./twl_ZEP.tsv",
                  "sort": 36,
                  "title": "Zephaniah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "hag",
                  "path": "./twl_HAG.tsv",
                  "sort": 37,
                  "title": "Haggai",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "zec",
                  "path": "./twl_ZEC.tsv",
                  "sort": 38,
                  "title": "Zechariah",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-ot"
                  ],
                  "identifier": "mal",
                  "path": "./twl_MAL.tsv",
                  "sort": 39,
                  "title": "Malachi",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "mat",
                  "path": "./twl_MAT.tsv",
                  "sort": 41,
                  "title": "Matthew",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "mrk",
                  "path": "./twl_MRK.tsv",
                  "sort": 42,
                  "title": "Mark",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "luk",
                  "path": "./twl_LUK.tsv",
                  "sort": 43,
                  "title": "Luke",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "jhn",
                  "path": "./twl_JHN.tsv",
                  "sort": 44,
                  "title": "John",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "act",
                  "path": "./twl_ACT.tsv",
                  "sort": 45,
                  "title": "Acts",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "rom",
                  "path": "./twl_ROM.tsv",
                  "sort": 46,
                  "title": "Romans",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "1co",
                  "path": "./twl_1CO.tsv",
                  "sort": 47,
                  "title": "1 Corinthians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "2co",
                  "path": "./twl_2CO.tsv",
                  "sort": 48,
                  "title": "2 Corinthians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "gal",
                  "path": "./twl_GAL.tsv",
                  "sort": 49,
                  "title": "Galatians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "eph",
                  "path": "./twl_EPH.tsv",
                  "sort": 50,
                  "title": "Ephesians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "php",
                  "path": "./twl_PHP.tsv",
                  "sort": 51,
                  "title": "Philippians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "col",
                  "path": "./twl_COL.tsv",
                  "sort": 52,
                  "title": "Colossians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "1th",
                  "path": "./twl_1TH.tsv",
                  "sort": 53,
                  "title": "1 Thessalonians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "2th",
                  "path": "./twl_2TH.tsv",
                  "sort": 54,
                  "title": "2 Thessalonians",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "1ti",
                  "path": "./twl_1TI.tsv",
                  "sort": 55,
                  "title": "1 Timothy",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "2ti",
                  "path": "./twl_2TI.tsv",
                  "sort": 56,
                  "title": "2 Timothy",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "tit",
                  "path": "./twl_TIT.tsv",
                  "sort": 57,
                  "title": "Titus",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "phm",
                  "path": "./twl_PHM.tsv",
                  "sort": 58,
                  "title": "Philemon",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "heb",
                  "path": "./twl_HEB.tsv",
                  "sort": 59,
                  "title": "Hebrews",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "jas",
                  "path": "./twl_JAS.tsv",
                  "sort": 60,
                  "title": "James",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "1pe",
                  "path": "./twl_1PE.tsv",
                  "sort": 61,
                  "title": "1 Peter",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "2pe",
                  "path": "./twl_2PE.tsv",
                  "sort": 62,
                  "title": "2 Peter",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "1jn",
                  "path": "./twl_1JN.tsv",
                  "sort": 63,
                  "title": "1 John",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "2jn",
                  "path": "./twl_2JN.tsv",
                  "sort": 64,
                  "title": "2 John",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "3jn",
                  "path": "./twl_3JN.tsv",
                  "sort": 65,
                  "title": "3 John",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "jud",
                  "path": "./twl_JUD.tsv",
                  "sort": 66,
                  "title": "Jude",
                  "versification": "ufw"
                },
                {
                  "categories": [
                    "bible-nt"
                  ],
                  "identifier": "rev",
                  "path": "./twl_REV.tsv",
                  "sort": 67,
                  "title": "Revelation",
                  "versification": "ufw"
                }
              ],
              "books": [
                "gen",
                "exo",
                "lev",
                "num",
                "deu",
                "jos",
                "jdg",
                "rut",
                "1sa",
                "2sa",
                "1ki",
                "2ki",
                "1ch",
                "2ch",
                "ezr",
                "neh",
                "est",
                "job",
                "psa",
                "pro",
                "ecc",
                "sng",
                "isa",
                "jer",
                "lam",
                "ezk",
                "dan",
                "hos",
                "jol",
                "amo",
                "oba",
                "jon",
                "mic",
                "nam",
                "hab",
                "zep",
                "hag",
                "zec",
                "mal",
                "mat",
                "mrk",
                "luk",
                "jhn",
                "act",
                "rom",
                "1co",
                "2co",
                "gal",
                "eph",
                "php",
                "col",
                "1th",
                "2th",
                "1ti",
                "2ti",
                "tit",
                "phm",
                "heb",
                "jas",
                "1pe",
                "2pe",
                "1jn",
                "2jn",
                "3jn",
                "jud",
                "rev"
              ],
              "is_valid": true,
              "validation_errors_url": "https://git.door43.org/api/v1/catalog/validation/unfoldingWord/en_twl/v80"
            }
          },
          "tarbar_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.tar.gz",
          "zipball_url": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.zip",
          "git_trees_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/git/trees/v80?recursive=1&per_page=99999",
          "contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/contents?ref=v80",
          "language": "en",
          "language_title": "English",
          "language_direction": "ltr",
          "language_is_gl": true,
          "subject": "TSV_Translation_Words_Links",
          "flavor_type": "parascriptural",
          "flavor": "x-TranslationWordsLinks",
          "abbreviation": "twl",
          "title": "unfoldingWord® Translation Words Links",
          "branch_or_tag_name": "v80",
          "ref_type": "tag",
          "commit_sha": "98d3ea0ca9a3c57eeff56b21fb37f6ebfc5075e2",
          "stage": "prod",
          "metadata_url": "https://git.door43.org/unfoldingWord/en_twl/raw/commit/98d3ea0ca9a3c57eeff56b21fb37f6ebfc5075e2/manifest.yaml",
          "metadata_json_url": "https://git.door43.org/api/v1/catalog/metadata/unfoldingWord/en_twl/v80",
          "metadata_api_contents_url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_twl/contents/manifest.yaml?ref=v80",
          "metadata_type": "rc",
          "metadata_version": "0.2",
          "content_format": "tsv9",
          "released": "2024-04-24T05:55:44Z",
          "ingredients": [
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "gen",
              "path": "./twl_GEN.tsv",
              "sort": 1,
              "title": "Genesis",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "exo",
              "path": "./twl_EXO.tsv",
              "sort": 2,
              "title": "Exodus",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "lev",
              "path": "./twl_LEV.tsv",
              "sort": 3,
              "title": "Leviticus",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "num",
              "path": "./twl_NUM.tsv",
              "sort": 4,
              "title": "Numbers",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "deu",
              "path": "./twl_DEU.tsv",
              "sort": 5,
              "title": "Deuteronomy",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jos",
              "path": "./twl_JOS.tsv",
              "sort": 6,
              "title": "Joshua",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jdg",
              "path": "./twl_JDG.tsv",
              "sort": 7,
              "title": "Judges",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "rut",
              "path": "./twl_RUT.tsv",
              "sort": 8,
              "title": "Ruth",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "1sa",
              "path": "./twl_1SA.tsv",
              "sort": 9,
              "title": "1 Samuel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "2sa",
              "path": "./twl_2SA.tsv",
              "sort": 10,
              "title": "2 Samuel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "1ki",
              "path": "./twl_1KI.tsv",
              "sort": 11,
              "title": "1 Kings",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "2ki",
              "path": "./twl_2KI.tsv",
              "sort": 12,
              "title": "2 Kings",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "1ch",
              "path": "./twl_1CH.tsv",
              "sort": 13,
              "title": "1 Chronicles",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "2ch",
              "path": "./twl_2CH.tsv",
              "sort": 14,
              "title": "2 Chronicles",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "ezr",
              "path": "./twl_EZR.tsv",
              "sort": 15,
              "title": "Ezra",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "neh",
              "path": "./twl_NEH.tsv",
              "sort": 16,
              "title": "Nehemiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "est",
              "path": "./twl_EST.tsv",
              "sort": 17,
              "title": "Esther",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "job",
              "path": "./twl_JOB.tsv",
              "sort": 18,
              "title": "Job",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "psa",
              "path": "./twl_PSA.tsv",
              "sort": 19,
              "title": "Psalms",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "pro",
              "path": "./twl_PRO.tsv",
              "sort": 20,
              "title": "Proverbs",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "ecc",
              "path": "./twl_ECC.tsv",
              "sort": 21,
              "title": "Ecclesiastes",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "sng",
              "path": "./twl_SNG.tsv",
              "sort": 22,
              "title": "Song of Solomon",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "isa",
              "path": "./twl_ISA.tsv",
              "sort": 23,
              "title": "Isaiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jer",
              "path": "./twl_JER.tsv",
              "sort": 24,
              "title": "Jeremiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "lam",
              "path": "./twl_LAM.tsv",
              "sort": 25,
              "title": "Lamentations",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "ezk",
              "path": "./twl_EZK.tsv",
              "sort": 26,
              "title": "Ezekiel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "dan",
              "path": "./twl_DAN.tsv",
              "sort": 27,
              "title": "Daniel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "hos",
              "path": "./twl_HOS.tsv",
              "sort": 28,
              "title": "Hosea",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jol",
              "path": "./twl_JOL.tsv",
              "sort": 29,
              "title": "Joel",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "amo",
              "path": "./twl_AMO.tsv",
              "sort": 30,
              "title": "Amos",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "oba",
              "path": "./twl_OBA.tsv",
              "sort": 31,
              "title": "Obadiah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "jon",
              "path": "./twl_JON.tsv",
              "sort": 32,
              "title": "Jonah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "mic",
              "path": "./twl_MIC.tsv",
              "sort": 33,
              "title": "Micah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "nam",
              "path": "./twl_NAM.tsv",
              "sort": 34,
              "title": "Nahum",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "hab",
              "path": "./twl_HAB.tsv",
              "sort": 35,
              "title": "Habakkuk",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "zep",
              "path": "./twl_ZEP.tsv",
              "sort": 36,
              "title": "Zephaniah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "hag",
              "path": "./twl_HAG.tsv",
              "sort": 37,
              "title": "Haggai",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "zec",
              "path": "./twl_ZEC.tsv",
              "sort": 38,
              "title": "Zechariah",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-ot"
              ],
              "identifier": "mal",
              "path": "./twl_MAL.tsv",
              "sort": 39,
              "title": "Malachi",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "mat",
              "path": "./twl_MAT.tsv",
              "sort": 41,
              "title": "Matthew",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "mrk",
              "path": "./twl_MRK.tsv",
              "sort": 42,
              "title": "Mark",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "luk",
              "path": "./twl_LUK.tsv",
              "sort": 43,
              "title": "Luke",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "jhn",
              "path": "./twl_JHN.tsv",
              "sort": 44,
              "title": "John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "act",
              "path": "./twl_ACT.tsv",
              "sort": 45,
              "title": "Acts",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "rom",
              "path": "./twl_ROM.tsv",
              "sort": 46,
              "title": "Romans",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1co",
              "path": "./twl_1CO.tsv",
              "sort": 47,
              "title": "1 Corinthians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2co",
              "path": "./twl_2CO.tsv",
              "sort": 48,
              "title": "2 Corinthians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "gal",
              "path": "./twl_GAL.tsv",
              "sort": 49,
              "title": "Galatians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "eph",
              "path": "./twl_EPH.tsv",
              "sort": 50,
              "title": "Ephesians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "php",
              "path": "./twl_PHP.tsv",
              "sort": 51,
              "title": "Philippians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "col",
              "path": "./twl_COL.tsv",
              "sort": 52,
              "title": "Colossians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1th",
              "path": "./twl_1TH.tsv",
              "sort": 53,
              "title": "1 Thessalonians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2th",
              "path": "./twl_2TH.tsv",
              "sort": 54,
              "title": "2 Thessalonians",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1ti",
              "path": "./twl_1TI.tsv",
              "sort": 55,
              "title": "1 Timothy",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2ti",
              "path": "./twl_2TI.tsv",
              "sort": 56,
              "title": "2 Timothy",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "tit",
              "path": "./twl_TIT.tsv",
              "sort": 57,
              "title": "Titus",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "phm",
              "path": "./twl_PHM.tsv",
              "sort": 58,
              "title": "Philemon",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "heb",
              "path": "./twl_HEB.tsv",
              "sort": 59,
              "title": "Hebrews",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "jas",
              "path": "./twl_JAS.tsv",
              "sort": 60,
              "title": "James",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1pe",
              "path": "./twl_1PE.tsv",
              "sort": 61,
              "title": "1 Peter",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2pe",
              "path": "./twl_2PE.tsv",
              "sort": 62,
              "title": "2 Peter",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "1jn",
              "path": "./twl_1JN.tsv",
              "sort": 63,
              "title": "1 John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "2jn",
              "path": "./twl_2JN.tsv",
              "sort": 64,
              "title": "2 John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "3jn",
              "path": "./twl_3JN.tsv",
              "sort": 65,
              "title": "3 John",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "jud",
              "path": "./twl_JUD.tsv",
              "sort": 66,
              "title": "Jude",
              "versification": "ufw"
            },
            {
              "categories": [
                "bible-nt"
              ],
              "identifier": "rev",
              "path": "./twl_REV.tsv",
              "sort": 67,
              "title": "Revelation",
              "versification": "ufw"
            }
          ],
          "books": [
            "gen",
            "exo",
            "lev",
            "num",
            "deu",
            "jos",
            "jdg",
            "rut",
            "1sa",
            "2sa",
            "1ki",
            "2ki",
            "1ch",
            "2ch",
            "ezr",
            "neh",
            "est",
            "job",
            "psa",
            "pro",
            "ecc",
            "sng",
            "isa",
            "jer",
            "lam",
            "ezk",
            "dan",
            "hos",
            "jol",
            "amo",
            "oba",
            "jon",
            "mic",
            "nam",
            "hab",
            "zep",
            "hag",
            "zec",
            "mal",
            "mat",
            "mrk",
            "luk",
            "jhn",
            "act",
            "rom",
            "1co",
            "2co",
            "gal",
            "eph",
            "php",
            "col",
            "1th",
            "2th",
            "1ti",
            "2ti",
            "tit",
            "phm",
            "heb",
            "jas",
            "1pe",
            "2pe",
            "1jn",
            "2jn",
            "3jn",
            "jud",
            "rev"
          ],
          "is_valid": true,
          "validation_errors_url": "https://git.door43.org/api/v1/catalog/validation/unfoldingWord/en_twl/v80",
          "resourceId": "twl",
          "languageId": "en",
          "checking_level": 3,
          "foundInCatalog": "NEW",
          "modified": "2024-04-24T05:55:44Z",
          "downloadUrl": "https://git.door43.org/unfoldingWord/en_twl/archive/v80.zip",
          "version": "80"
        }
      ]
    }
  }
}
