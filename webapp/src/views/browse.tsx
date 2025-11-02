import React, { useState, useEffect } from 'react';

export default function Browse() {
	const [generateMode, setGenerateMode] = useState('description');
	const [componentStream, setComponentStream] = useState<string | boolean>(false);
	const [userInputDescription, setUserInputDescription] = useState('');
	const [userInputJson, setUserInputJson] = useState('');
	const [processing, setProcessing] = useState(false);

	const libRelativePath = `../components/openv0_generated`
	const [loadedComponents, setLoadedComponents] = useState<any[]>([]);
	const [openv0ComponentsList, setOpenv0ComponentsList] = useState<any[]>([]);
	const [deletingComponent, setDeletingComponent] = useState<string | null>(null);

	const svgStyle = { fill: '#777' };

	async function fetchComponents(){
		const response = await fetch(
			`http://localhost:3000/components/list?framework=react&components=nextui&icons=lucide`
		);
		const data = await response.json();
		console.log(data)
		setOpenv0ComponentsList( data.items )
		setLoadedComponents( [...Array(data.items.length).keys()].map(()=>false) )

		const imports = data.items.map(async (component: any) => {
			// Construct the import path for each child component
			const importPath = `${libRelativePath}/${component.name}/${component.name}_${component.latest}.tsx`;
			console.log(importPath)
			try {
				// Use dynamic import to load the component, and catch any errors
				let module
				try {
					module = await import(importPath);
				} catch(e) {
					return false
				}
				return {
					name: component.name,
					versions: component.versions,
					latest: component.latest,
					component: module.default,
				};
			} catch (error) {
				console.error(error);
				return false
			}
		});

		Promise.all(imports).then((components) => {
			setLoadedComponents(components.filter(e=>e));
		});

	}

	const deleteComponent = async (componentName: string, event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		
		if (!confirm(`Are you sure you want to delete "${componentName}"?`)) {
			return;
		}

		setDeletingComponent(componentName);
		
		try {
			const response = await fetch(
				`http://localhost:3000/components/delete/${componentName}?framework=react&components=nextui&icons=lucide`,
				{
					method: 'DELETE',
				}
			);
			
			const data = await response.json();
			
			if (data.success) {
				// Refresh the components list
				fetchComponents();
			} else {
				alert('Failed to delete component: ' + data.error);
			}
		} catch (error) {
			console.error('Error deleting component:', error);
			alert('Failed to delete component');
		} finally {
			setDeletingComponent(null);
		}
	};

	const newComponent = async () => {
		if (processing) return;
		if (generateMode === 'description' && !userInputDescription) return;
		if (generateMode === 'json' && !userInputJson) return;
		setProcessing(true)
		setComponentStream('')
		let received_stream = ''
		console.dir({
			framework : `react`,
			components: `nextui`,
			icons: `lucide`,
			description: generateMode === `description` ? userInputDescription : userInputJson,
		})
		const response = await fetch(
			`http://localhost:3000/components/new/${generateMode}` ,
			{
				method: "POST",
				headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
				body : JSON.stringify({
					framework : `react`,
					components: `nextui`,
					icons: `lucide`,
					description: generateMode === `description` ? userInputDescription : false,
					json: generateMode === `json` ? userInputJson : false,
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const reader = response.body!.getReader();
		const textDecoder = new TextDecoder(); // Create a TextDecoder instance
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			const text = textDecoder.decode(value); // Decode the received data as text
			received_stream += text; // Append received text to the container
			setComponentStream( received_stream.split('\n').slice(-5).join('\n') )
		}

		setComponentStream(false)
		setProcessing(false)

		fetchComponents()
	}

  useEffect(() => {
		fetchComponents()
  }, []);


	return (
		<>
			<div className="min-h-screen min-h-screen overflow-y-auto antialiased bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
				<div className={!processing ? "" : 'opacity-20'}>
					{/* Beautiful Welcome Banner */}
					{openv0ComponentsList.length === 0 && !componentStream && (
						<div className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mb-6 shadow-2xl">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
								Start Creating Magic ✨
							</h1>
							<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
								Describe any UI component you can imagine, and watch as AI brings it to life in seconds.
							</p>
							<div className="grid md:grid-cols-3 gap-6 text-left">
								<div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900">
									<div className="text-3xl mb-3">💬</div>
									<h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Describe</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300">Use natural language to describe what you want</p>
								</div>
								<div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900">
									<div className="text-3xl mb-3">⚡</div>
									<h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Generate</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300">AI creates production-ready code instantly</p>
								</div>
								<div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-pink-100 dark:border-pink-900">
									<div className="text-3xl mb-3">🎨</div>
									<h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Iterate</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300">Refine and perfect with simple prompts</p>
								</div>
							</div>
						</div>
					)}
					
					<div className="fixed bottom-0 left-0 w-screen max-w-screen
				    px-6 md:px-32 xl:px-72 py-6
				    grid sm:flex items-center space-x-2 xl:space-x-4 space-y-1 z-50
				    bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900">

						<div>
				      {generateMode === 'json' ? (
				        <a href="#" onClick={() => setGenerateMode('description')} id="mode_json" className="hidden sm:block md:-ml-10">
				          <div className="rounded rounded-full shadow shadow-md dark:shadow-[#111]
				            text-center p-4 text-center
				            bg-[#ddd] hover:bg-white
				            dark:bg-[#151515] dark:hover:bg-[#212121]
				            duration-200 cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3a3a3a" viewBox="0 0 24 24">
											<path d="M23 10.826v2.349c-1.562 0-3 1.312-3 2.857 0 2.181 1.281 5.968-6 5.968v-2.002c4.917 0 3.966-1.6 3.966-3.967 0-2.094 1.211-3.5 2.278-4.031-1.067-.531-2.278-1.438-2.278-3.312 0-2.372.94-4.692-3.966-4.686v-2.002c7.285 0 6 4.506 6 6.688 0 1.544 1.438 2.138 3 2.138zm-19-2.138c0-2.182-1.285-6.688 6-6.688v2.002c-4.906-.007-3.966 2.313-3.966 4.686 0 1.875-1.211 2.781-2.278 3.312 1.067.531 2.278 1.938 2.278 4.031 0 2.367-.951 3.967 3.966 3.967v2.002c-7.281 0-6-3.787-6-5.969 0-1.545-1.438-2.857-3-2.857v-2.349c1.562.001 3-.593 3-2.137z"/>
										</svg>
				          </div>
				        </a>
				      ) : (
				        <a href="#" onClick={() => setGenerateMode('json')} id="mode_description" className="hidden sm:block md:-ml-10">
				          <div className="rounded rounded-full shadow shadow-md dark:shadow-[#111]
				            text-center p-4 text-center
				            bg-[#ddd] hover:bg-white
				            dark:bg-[#151515] dark:hover:bg-[#212121]
				            duration-200 cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3a3a3a" viewBox="0 0 24 24">
											<path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm-3.5 10c0 .829-.671 1.5-1.5 1.5-.828 0-1.5-.671-1.5-1.5s.672-1.5 1.5-1.5c.829 0 1.5.671 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5c.829 0 1.5-.671 1.5-1.5s-.671-1.5-1.5-1.5zm5 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5c.829 0 1.5-.671 1.5-1.5s-.671-1.5-1.5-1.5z"/>
										</svg>
				          </div>
				        </a>
				      )}
				    </div>

						<div className="sm:hidden flex flex-grow items-center pb-1 space-x-1">
				      <a
				        href="#"
				        onClick={() => setGenerateMode('description')}
				        className="shadow shadow-md
				          text-base text-center p-2
				          rounded rounded-lg
				          bg-[#f0f0f0] hover:bg-white
				          dark:bg-[#151515] dark:hover:bg-[#111] dark:text-[#bbb]
				          duration-200 cursor-pointer w-full"
				      >
				        description
				      </a>
				      <a
				        href="#"
				        onClick={() => setGenerateMode('json')}
				        className="shadow shadow-md
				          text-base text-center p-2
				          rounded rounded-lg
				          bg-[#f0f0f0] hover:bg-white
				          dark:bg-[#151515] dark:hover:bg-[#111] dark:text-[#bbb]
				          duration-200 cursor-pointer w-full"
				      >
				        json
				      </a>
				    </div>

						<div className="sm:w-full rounded-2xl p-3 flex items-center text-xl duration-200 shadow-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 dark:text-white hover:border-purple-400 dark:hover:border-purple-600 transition-all">
				      <div className="sm:mx-4 w-full max-h-32 overflow-auto">
				        {generateMode === 'description' ? (
				          <div className="relative">
				            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
				              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
				              </svg>
				            </div>
				            <input
				              className="w-full pl-12 pr-4 py-4 text-base md:text-lg bg-transparent outline-none border-none ring-none placeholder-gray-400 dark:placeholder-gray-500"
				              placeholder="Describe your dream component... ✨"
				              value={userInputDescription}
				              onChange={(e) => setUserInputDescription(e.target.value)}
				              onKeyDown={(e) => {
				                if (e.key === 'Enter' && !e.shiftKey) {
				                  e.preventDefault();
				                  newComponent();
				                }
				              }}
				            />
				          </div>
				        ) : (
				          <div className="relative">
				            <div className="absolute left-3 top-4 text-purple-500">
				              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
				              </svg>
				            </div>
				            <textarea
				              className="w-full pl-12 pr-4 py-4 text-sm md:text-base resize-none font-mono bg-transparent outline-none border-none ring-none placeholder-gray-400 dark:placeholder-gray-500"
				              rows={4}
				              placeholder='{ "component": "button", "style": "modern" }'
				              value={userInputJson}
				              onChange={(e) => setUserInputJson(e.target.value)}
				            />
				          </div>
				        )}
				      </div>
				    </div>

						<div className="sm:mx-4 duration-200">
				      <button
				        onClick={newComponent}
				        disabled={processing}
				        className="group relative rounded-2xl shadow-2xl p-5 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 duration-200 cursor-pointer transform hover:scale-110 active:scale-95 transition-all disabled:cursor-not-allowed"
				      >
				        {processing ? (
				          <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
				            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				          </svg>
				        ) : (
								<svg height="30" width="30" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#fff" className="drop-shadow-lg">
									<g id="SVGRepo_bgCarrier" strokeWidth="0"/>
									<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
									<g id="SVGRepo_iconCarrier">
										<path style={svgStyle} d="M333.411,188.132c-6.534-6.534-17.132-6.534-23.666,0L14.443,483.433 c-6.535,6.535-6.535,17.131,0,23.666c3.268,3.268,7.551,4.902,11.834,4.901c4.283,0,8.566-1.634,11.832-4.901l295.302-295.301 C339.947,205.263,339.946,194.666,333.411,188.132z"/>
										<path style={svgStyle} d="M333.411,188.132c-0.297-0.297-0.611-0.566-0.925-0.836L13.607,506.175 c0.27,0.312,0.539,0.627,0.836,0.924c3.268,3.268,7.551,4.902,11.834,4.901c4.283,0,8.566-1.634,11.832-4.901l295.302-295.301 C339.947,205.263,339.946,194.666,333.411,188.132z"/>
										<path style={svgStyle} d="M454.32,219.728l-38.766-51.947l20.816-61.386c2.046-6.032,0.489-12.704-4.015-17.208 c-4.504-4.504-11.175-6.061-17.208-4.015l-61.385,20.816l-51.95-38.766c-5.103-3.809-11.929-4.392-17.605-1.499 c-5.676,2.893-9.217,8.756-9.136,15.125l0.829,64.815l-52.924,37.426c-5.201,3.678-7.863,9.989-6.867,16.282 c0.996,6.291,5.479,11.471,11.561,13.363l61.898,19.241l19.24,61.897c1.891,6.082,7.071,10.565,13.363,11.561 c0.876,0.138,1.75,0.206,2.622,0.206c5.375,0,10.494-2.595,13.66-7.072l37.426-52.924l64.815,0.828 c6.322,0.051,12.233-3.462,15.125-9.136C458.713,231.661,458.13,224.833,454.32,219.728z"/>
										<polygon style={svgStyle} points="160.014,42.848 173.373,67.274 197.799,80.633 173.373,93.991 160.014,118.417 146.656,93.991 122.23,80.633 146.656,67.274 "/>
										<g>
											<polygon style={svgStyle} points="352.14,364.732 362.946,384.489 382.703,395.294 362.946,406.1 352.14,425.857 341.335,406.1 321.577,395.294 341.335,384.489 "/>
											<polygon style={svgStyle} points="367.337,0 378.142,19.757 397.9,30.563 378.142,41.368 367.337,61.126 356.531,41.368 336.775,30.563 356.531,19.757 "/>
											<polygon style={svgStyle} points="484.168,130.689 490.635,142.514 502.459,148.98 490.635,155.447 484.168,167.271 477.702,155.447 465.877,148.98 477.702,142.514 "/>
										</g>
										<g>
											<polygon style={svgStyle} points="492.627,294.117 484.792,320.866 492.627,347.615 465.877,339.78 439.129,347.615 446.963,320.866 439.129,294.117 465.877,301.951 "/>
											<path style={svgStyle} d="M455.82,237.334c2.892-5.675,2.311-12.501-1.499-17.606l-38.766-51.947l20.816-61.387 c2.046-6.032,0.49-12.704-4.014-17.208c-0.296-0.296-0.6-0.576-0.914-0.846L288.228,231.555l1.343,0.417l19.24,61.898 c1.891,6.082,7.071,10.565,13.363,11.561c0.876,0.138,1.75,0.206,2.622,0.206c5.375,0,10.494-2.595,13.66-7.072l37.426-52.924 l64.815,0.828C447.017,246.522,452.928,243.009,455.82,237.334z"/>
										</g>
									</g>
								</svg>
				        )}
				      </button>
				    </div>

					</div>
				</div>

				<div className="max-w-8xl mx-auto
				  text-base
				  py-3 pt-0 px-6 xl:px-32
				  mb-52
				  min-h-screen
				  dark:bg-[#050505] dark:text-[#fff]">

					{openv0ComponentsList.length || componentStream ? (
		        <div className="p-2 rounded grid sm:grid-cols-2 xl:grid-cols-3 items-start gap-4">

						{loadedComponents.map((component, index) => (

							<div key={index} className="relative group transform transition-all duration-300 hover:scale-105">
								<a href={`/app/view/${component.name}`} className="cursor-pointer block">
					      <div className="p-4 rounded-xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-purple-300">
					        <div className="flex justify-between items-start mb-3">
					          <div>
					            <h2 className="text-lg font-semibold text-gray-800">{component.name}</h2>
					            <h2 className="text-xs text-gray-500 font-light mt-1">{component.versions} version(s)</h2>
					          </div>
					          <button
					            onClick={(e) => deleteComponent(component.name, e)}
					            disabled={deletingComponent === component.name}
					            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-red-100 rounded-lg"
					            title="Delete component"
					          >
					            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
					              <path d="M3 6h18"></path>
					              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
					              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
					            </svg>
					          </button>
					        </div>
					        <div className="my-2 bg-gradient-to-br from-gray-50 to-purple-50 dark:bg-[#222] dark:text-white p-4 text-sm max-h-52 max-w-32 overflow-hidden rounded-lg border border-purple-100">
					          {component && component.component !== 'fail' ? (
					            <div style={{zoom: '30%'}}>
												<component.component  />
											</div>
					          ) : component.component === 'fail' ? (
					            <p className="text-xs text-red-500">could not import</p>
					          ) : (
					            <p className="text-xs text-gray-400">loading...</p>
					          )}
					        </div>
					      </div>
					    </a>
					  </div>

			      ))}

						{componentStream && (
				      <div className="relative animate-pulse">
				        <div className="p-4 rounded-xl bg-white shadow-lg border-2 border-purple-400">
				          <div className="flex items-center gap-2 mb-3">
				            <svg className="w-5 h-5 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
				              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				            </svg>
				            <div>
				              <h2 className="text-lg font-semibold text-purple-700">New Component</h2>
				              <h2 className="text-xs text-purple-500 font-light">generating...</h2>
				            </div>
				          </div>
				          <div className="my-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:bg-[#222] dark:text-white p-4 text-xs max-h-52 max-w-32 overflow-hidden whitespace-pre-wrap break-words font-mono rounded-lg border border-purple-200">
				            {componentStream}
				          </div>
				        </div>
				      </div>
				    )}


		        </div>
		      ) : (
		        <div className="max-w-5xl py-52 mx-auto text-center text-7xl opacity-30 text-[#777] break-words font-bold">
		          openv0
		        </div>
		      )}

				</div>
			</div>
		</>
  )
}
