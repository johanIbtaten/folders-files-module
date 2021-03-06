function uuid() {
  return Math.random()
    .toString(16)
    .slice(2);
}

// Folders //

function createFolder(name) {
  return new Promise(resolve => {
    // On simule un temps de traitement de 500ms
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call add folder', { name });

      // On retourne une promesse résolue avec un objet qui contient
      // le folder vide avec un id unique
      resolve({
        success: true,
        message: { folder: { id: uuid(), name, items: [] } }
      });
    }, 500);
  });
}

function saveFoldersPosition(folders) {
  return new Promise(resolve => {
    //ajax goes here
    console.log(
      'ajax call folders',
      folders.map(folder => folder.id)
    );

    resolve({
      success: true,
      message: null
    });
  });
}

function updateFolderContent({ toFolderId, fileId }) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call update folder content', {
        id: toFolderId,
        fileId: fileId
      });

      resolve({
        success: true,
        message: null
      });
    }, 500);
  });
}

function renameFolder(folderUpdated) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call rename folder', {
        id: folderUpdated.id,
        name: folderUpdated.name
      });

      resolve({
        success: true,
        message: null
      });
    }, 500);
  });
}

function deleteFolder(folderId) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call delete folder', folderId);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

// // Snippets //

// function saveSnippetsPosition(snippets) {
//   return new Promise(resolve => {
//     //ajax goes here
//     console.log(
//       'ajax call snippets',
//       snippets.map(snippet => {
//         return {
//           id: snippet.id,
//           category_id: snippet.category_id,
//           position: snippet.position
//         };
//       })
//     );

//     resolve({
//       success: true,
//       message: null
//     });
//   });
// }

// function saveSnippet(snippetToSave) {
//   return new Promise(resolve => {
//     setTimeout(function() {
//       //ajax goes here
//       console.log('ajax call save snippet', {
//         id: snippetToSave.id,
//         title: snippetToSave.title,
//         contents: snippetToSave.contents
//       });
//       resolve({
//         success: true,
//         message: null
//       });
//     }, 1000);
//   });
// }

// function getEmptySnippet() {
//   return new Promise(resolve => {
//     setTimeout(function() {
//       //ajax goes here
//       console.log('ajax call get empty snippet');

//       resolve({
//         success: true,
//         message: {
//           snippet: {
//             id: uuid(),
//             title: '',
//             category_id: 0,
//             position: 1000,
//             contents: [
//               {
//                 language_id: 1,
//                 content: ''
//               },
//               {
//                 language_id: 2,
//                 content: ''
//               },
//               {
//                 language_id: 3,
//                 content: ''
//               }
//             ]
//           }
//         }
//       });
//     }, 1000);
//   });
// }

// function deleteSnippet(snippetId) {
//   return new Promise(resolve => {
//     setTimeout(function() {
//       //ajax goes here
//       console.log('ajax call delete snippet', snippetId);

//       resolve({
//         success: true,
//         message: null
//       });
//     }, 1000);
//   });
// }

// // Datas //

function load() {
  return new Promise(resolve => {
    let response = {
      success: true,
      message: {
        folders: [
          {
            id: 0,
            name: 'unclassified',
            items: []
          },
          {
            id: 1,
            name: "Campagne d'été",
            items: []
          },
          {
            id: 2,
            name: "Campagne d'hiver",
            items: []
          },
          {
            id: 3,
            name: 'Mes tests de campagnes',
            items: []
          }
        ],
        items: [
          {
            id: 1,
            name:
              'Joyeuse Saint Valentin i fusdiu iosdu fisdufi usiodu fiu sdiofu sidufu sdf usdiof iosdf isdifuisd',
            status: 'draft',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          },
          {
            id: 2,
            name: "L'été approche !",
            status: 'planned',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          },
          {
            id: 3,
            name: 'Le printemps approche !',
            status: 'sent',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              },
              {
                name: 'Another list',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          },
          {
            id: 4,
            name: "L'automne approche !",
            status: 'sent',
            created_at: '2020-05-11 12:00:00',
            date_scheduled: '2020-05-11 12:00:00',
            date_sent: '2020-05-11 12:00:00',
            recipient_count: '2020-05-11 12:00:00',
            opened_count: '2020-05-11 12:00:00',
            clicked_count: '2020-05-11 12:00:00',
            sending_list: [
              {
                name: 'Liste de mes clients',
                total_customer: 5122
              }
            ],
            routes: {
              edit: '/crm/edit',
              reporting: '/crm/reporting'
            }
          }
        ]
      }
    };

    resolve(response);
  });
}

export default {
  load,
  createFolder,
  saveFoldersPosition,
  updateFolderContent,
  renameFolder,
  deleteFolder
  // deleteCategory,
  // saveSnippetsPosition,
  // saveSnippet,
  // getEmptySnippet,
  // deleteSnippet
};
